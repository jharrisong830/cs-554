// helper functions

import { GraphQLError } from "graphql";
import {
    authors as authorCollection,
    books as bookCollection,
    publishers as publisherCollection
} from "./config/mongoCollections.js";
import redis from "redis";
import { ObjectId } from "mongodb";

const cache = redis.createClient();
await cache.connect();

/** validation */

/**
 * validates the response from a redis operation (typically "OK" on success)
 * @param {*} res response from a redis operation
 *
 * @throws {GraphQLError} if response is not "OK"
 */
export const validateRedisResponse = (res) => {
    if (typeof res !== "string" || res !== "OK") {
        throw new GraphQLError("invalid redis response", {
            extensions: { code: "INTERNAL_SERVER_ERROR" }
        });
    }
};

/**
 * returns an ObjectId, throws error if invalid
 * @param {string} id
 * @returns {ObjectId}
 * @throws {GraphQLError}
 */
export const returnValidId = (id) => {
    if (id instanceof ObjectId) return id; // return immediately if already ObjectId
    if (typeof id !== "string" || !ObjectId.isValid(id.trim()))
        throw new GraphQLError(`Invalid id '${id.trim()}'`, {
            extensions: { code: "BAD_USER_INPUT" }
        });
    return new ObjectId(id.trim());
};

/**
 * validates a date of birth string, in the form of 'MM/DD/YYYY'
 *
 * @param {string} dateOfBirth     DOB to be validated
 *
 * @returns {string} fully validated date of birth
 * @throws {GraphQLError} on invalid date or format
 */
export const valiDate = (dateOfBirth) => {
    if (typeof dateOfBirth !== "string" || dateOfBirth.trim().length !== 10)
        // len 10, otherwise invalid format
        throw new GraphQLError("Unexpected date type/format", {
            extensions: { code: "BAD_USER_INPUT" }
        });

    dateOfBirth = dateOfBirth.trim();
    const dobArray = dateOfBirth.split("/").map((num) => parseInt(num)); // [MM, DD, YYYY]

    if (!Array.isArray(dobArray) || dobArray.length !== 3) {
        throw new GraphQLError("Unexpected date formatting, parsing error", {
            extensions: { code: "BAD_USER_INPUT" }
        });
    }
    const [month, day, year] = dobArray;
    if (
        // date validation, error triggered if any of the following are true
        year < 0 ||
        month < 0 ||
        month > 11 || // why tf is it month index lmao
        day < 1 ||
        day > 31 || // day must be in [1, 31] or else immediately invalid
        (month === 1 && day > (year % 4 === 0 ? 29 : 28)) || // feb, year % 4 -> leap year, max 29 days, else 28
        ([3, 5, 8, 10].includes(month) && day > 30) // april, june, september, november only have 30 days
    ) {
        throw new GraphQLError(`Date '${dateOfBirth}' is invalid`, {
            extensions: { code: "BAD_USER_INPUT" }
        });
    }
    return dateOfBirth;
};

/** database operations */

export const getBookById = async (bookId) => {
    const bookCol = await bookCollection();
    const book = await bookCol.findOne({ _id: bookId });
    if (!book)
        throw new GraphQLError(`No book with id '${bookId}' found`, {
            extensions: { code: "NOT_FOUND" }
        });
    return book;
};

export const getAuthorById = async (authorId) => {
    const authorCol = await authorCollection();
    const author = await authorCol.findOne({ _id: authorId });
    if (!author)
        throw new GraphQLError(`No author with id '${authorId}' found`, {
            extensions: { code: "NOT_FOUND" }
        });
    return author;
};

export const getPublisherById = async (publisherId) => {
    const publisherCol = await publisherCollection();
    const publisher = await publisherCol.findOne({ _id: publisherId });
    if (!publisher)
        throw new GraphQLError(`No publisher with id '${publisherId}' found`, {
            extensions: { code: "NOT_FOUND" }
        });
    return publisher;
};

export const getChapterById = async (chapterId) => {
    const chapterCol = await chapterCollection();
    const chapter = await chapterCol.findOne({ _id: chapterId });
    if (!chapter)
        throw new GraphQLError(`No chapter with id '${chapterId}' found`, {
            extensions: { code: "NOT_FOUND" }
        });
    return chapter;
};

/**
 * given a book object, completely remove it from the database and cache (including from any publishers or authors it is associated with)
 *
 * @param {ObjectId} bookId
 * @param {string} alreadyRemoved database entry already deleted (value in ["publisher", "author", "none"], no need to pull from that entry as it doesn't exist anymore)
 *
 * @returns {Object} deleted book (should be same as parameter)
 * @throws {GraphQLError} on database error
 * not a lot of validation in this function bc everything being passed to it has already been vetted
 */
export const removeBookFromDatabase = async (bookId, alreadyRemoved) => {
    const authorCol = await authorCollection();
    const publisherCol = await publisherCollection();
    const bookCol = await bookCollection();

    const book = await getBookById(bookId);

    // will hit both of these statements if alreadyRemoved === "none"
    if (alreadyRemoved !== "publisher") {
        const updatePub = await publisherCol.updateOne(
            { _id: book.publisherId },
            { $pull: { books: book._id } }
        );
        if (!updatePub.acknowledged || updatePub.matchedCount === 0)
            throw new GraphQLError(
                `Could not edit publisher with id '${book.publisherId}'`,
                {
                    extensions: {
                        code:
                            updatePub.matchedCount === 0
                                ? "NOT_FOUND"
                                : "INTERNAL_SERVER_ERROR"
                    }
                }
            ); // not found if the update filter didn't match any docs

        const insertedPublisher = await getPublisherById(book.publisherId); // get the publisher
        await updateKeyIfPresent(
            insertedPublisher,
            `publisher:${book.publisherId.toString()}`,
            -1
        ); // update the publisher if in the cache
        await updateListIfPresent("publishers"); // refresh the publisher list in the cache so it includes the updated publisher
        await updateFoundedYearResults(); // update range results
    }
    if (alreadyRemoved !== "author") {
        const updateAuth = await authorCol.updateOne(
            { _id: book.authorId },
            { $pull: { books: book._id } }
        );
        if (!updateAuth.acknowledged || updateAuth.matchedCount === 0)
            throw new GraphQLError(
                `Could not edit author with id '${book.authorId}'`,
                {
                    extensions: {
                        code:
                            updateAuth.matchedCount === 0
                                ? "NOT_FOUND"
                                : "INTERNAL_SERVER_ERROR"
                    }
                }
            ); // not found if the update filter didn't match any docs

        const insertedAuthor = await getAuthorById(book.authorId); // get the author
        await updateKeyIfPresent(
            insertedAuthor,
            `author:${book.authorId.toString()}`,
            -1
        ); // update the author if in the cache
        await updateListIfPresent("authors"); // refresh the author list in the cache so it includes the updated author
        await updateAuthorSearches(); // update all searches
    }

    // now, delete the book!
    const deleteInfo = await bookCol.deleteOne({ _id: book._id });
    if (
        !deleteInfo ||
        !deleteInfo.acknowledged ||
        deleteInfo.deletedCount !== 1
    )
        throw new GraphQLError(`Could not delete book with id '${book._id}'`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" }
        });

    await removeFromCacheIfPresent(`book:${bookId.toString()}`); // bye bye!
    await updateListIfPresent("books"); // refresh the book list in the cache so it includes the new book
    await updateGenreIfPresent(book.genre); // update the genre list for this book

    return book;
};

/** redis cache operations */

/**
 * adds an object with a set expiry time to the cache
 * @param {Object} obj
 * @param {string} key
 * @param {number} expiration time in seconds for which this value will be valid (-1 if no expiry)
 */
export const addToCache = async (obj, key, expiration) => {
    validateRedisResponse(await cache.json.set(key, "$", obj));
    console.log(`ADDED   : ${key}`);
    if (expiration !== -1) {
        if (!(await cache.expire(key, expiration)))
            throw new GraphQLError(
                "couldn't add expiry time to cached object",
                { extensions: { code: "INTERNAL_SERVER_ERROR" } }
            );
    }
};

/**
 * fetches an item from the cache by its key
 * @param {string} key
 * @returns {Object | undefined} undefined if object not found in the cache
 */
export const getFromCache = async (key) => {
    const response = await cache.json.get(key);
    console.log(`${response ? "HIT " : "MISS"} for: ${key}`);
    return response ? response : undefined;
};

/**
 * updates an object if it has changed
 * @param {Object} obj new version of the object to overwrite the old one
 * @param {string} key
 * @param {number} expiration time in seconds for which this value will be valid (-1 if no expiry)
 */
export const updateKeyIfPresent = async (obj, key, expiration) => {
    if (await getFromCache(key)) {
        await addToCache(obj, key, expiration);
    }
};

/**
 * variation of updateKeyIfPresent for collection lists
 * @param {string} key value in ["authors", "publishers", "books"]
 * @throws {GraphQLError} on database error or cache error
 */
export const updateListIfPresent = async (key) => {
    if (await getFromCache(key)) {
        let result;
        if (key === "books") {
            const bookCol = await bookCollection();
            result = await bookCol.find({}).toArray();
        } else if (key === "authors") {
            const authorCol = await authorCollection();
            result = await authorCol.find({}).toArray();
        } else {
            // key === "publishers"
            const publisherCol = await publisherCollection();
            result = await publisherCol.find({}).toArray();
        }

        if (!result)
            throw new GraphQLError(`Could not fetch ${key}`, {
                extensions: { code: "INTERNAL_SERVER_ERROR" }
            });
        await addToCache(result, key, 3600); // all lists have a 1-hour expiry
    }
};

/**
 * variation of updateKeyIfPresent for genre cache
 * @param {string} genre
 * @throws {GraphQLError} on database error or cache error
 */
export const updateGenreIfPresent = async (genre) => {
    if (await getFromCache(`genre:${genre}`)) {
        const bookCol = await bookCollection();
        const genreBooks = await bookCol.find({ genre: genre }).toArray();
        if (!genreBooks)
            throw new GraphQLError(
                `Could not fetch books with genre matching '${genre}`,
                { extensions: { code: "NOT_FOUND" } }
            );
        await addToCache(genreBooks, `genre:${genre}`, -1); // add to cahce with no expiration
    }
};

/**
 * updates all cahced searches by year founded results
 * @throws {GraphQLError} on database error or cache error
 */
export const updateFoundedYearResults = async () => {
    const allRanges = await cache.keys("foundedYear:*:*"); // get all ranges in the cache
    for (const k of allRanges) {
        const [min, max] = k
            .split(":")
            .slice(-2)
            .map((str) => parseInt(str)); // get last two elements (min and max)
        const publisherCol = await publisherCollection();
        const allPublishers = await publisherCol
            .find({ establishedYear: { $gt: min, $lt: max } })
            .toArray();
        if (!allPublishers)
            throw new GraphQLError("Could not fetch publishers", {
                extensions: { code: "INTERNAL_SERVER_ERROR" }
            });
        await addToCache(allPublishers, `foundedYear:${min}:${max}`, -1); // add to cahce with no expiration
    }
};

/**
 * updates all cached searches (called on mutations of an author)
 * @throws {GraphQLError} on database or cache error
 */
export const updateAuthorSearches = async () => {
    const allSearches = await cache.keys("search:author:*"); // get all search results in the cache
    for (const k of allSearches) {
        const searchTerm = k.slice(14); // get everything after "search:author:"
        const reSearch = new RegExp(`.*${searchTerm}.*`, "gi"); // matches when searchTerm appears anywhere in the string (case insensitive)
        const results = await authorCol.find({ name: reSearch }).toArray();
        if (!results)
            throw new GraphQLError(
                `Could not find any authors matching '${searchTerm}'`,
                { extensions: { code: "NOT_FOUND" } }
            );
        await addToCache(results, `search:author:${searchTerm}`, -1); // add to cahce with no expiration
    }
};

/**
 * removes a key from the cache
 * @param {string} key
 * @throws {GraphQLError} if unable to remove
 */
export const removeFromCacheIfPresent = async (key) => {
    if (await getFromCache(key)) {
        const response = await cache.json.del(key); // delete the value from the root (whole object)
        if (response !== 0)
            // returns number of paths deleted, should be non-zero
            throw new GraphQLError(`Could not delete ${key}`, {
                extensions: { code: "INTERNAL_SERVER_ERROR" }
            });
        console.log(`REMOVED : ${key}`);
    }
};
