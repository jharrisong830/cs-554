import { GraphQLError } from "graphql";
import { authors as authorCollection, books as bookCollection, publishers as publisherCollection, chapters as chapterCollection } from "./config/mongoCollections.js";
import {
    returnValidId,
    valiDate,
    getBookById,
    getAuthorById,
    getPublisherById,
    removeBookFromDatabase,
    addToCache,
    getFromCache,
    updateListIfPresent,
    updateKeyIfPresent,
    removeFromCacheIfPresent,
    updateGenreIfPresent,
    updateAuthorSearches,
    updateFoundedYearResults,
    getChapterById
} from "./helpers.js";

export const resolvers = {
    Query: {
        authors: async (_, args) => {
            const cacheResponse = await getFromCache("authors"); // check the cache first
            if (cacheResponse) return cacheResponse;

            const authorCol = await authorCollection();
            const allAuthors = await authorCol.find({}).toArray();
            if (!allAuthors) 
                throw new GraphQLError("Could not fetch authors", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            await addToCache(allAuthors, "authors", 3600); // add to cahce with one hour expiry
            return allAuthors;
        },
        books: async (_, args) => {
            const cacheResponse = await getFromCache("books"); // check the cache first
            if (cacheResponse) return cacheResponse;

            const bookCol = await bookCollection();
            const allBooks = await bookCol.find({}).toArray();
            if (!allBooks)
                throw new GraphQLError("Could not fetch books", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            await addToCache(allBooks, "books", 3600); // add to cahce with one hour expiry
            return allBooks;
        },
        publishers: async (_, args) => {
            const cacheResponse = await getFromCache("publishers"); // check the cache first
            if (cacheResponse) return cacheResponse;

            const publisherCol = await publisherCollection();
            const allPublishers = await publisherCol.find({}).toArray();
            if (!allPublishers)
                throw new GraphQLError("Could not fetch publishers", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            await addToCache(allPublishers, "publishers", 3600); // add to cahce with one hour expiry
            return allPublishers;
        },
        getAuthorById: async (_, args) => {
            args._id = args._id.trim();
            const cacheResponse = await getFromCache(`author:${args._id}`); // check the cache first
            if (cacheResponse) return cacheResponse;

            const id = returnValidId(args._id);
            const author = await getAuthorById(id);
            await addToCache(author, `author:${args._id}`, -1); // add to cahce with no expiration
            return author;
        },
        getBookById: async (_, args) => {
            args._id = args._id.trim();
            const cacheResponse = await getFromCache(`book:${args._id}`); // check the cache first
            if (cacheResponse) return cacheResponse;

            const id = returnValidId(args._id);
            const book = await getBookById(id);
            await addToCache(book, `book:${args._id}`, -1); // add to cahce with no expiration
            return book;
        },
        getPublisherById: async (_, args) => {
            args._id = args._id.trim();
            const cacheResponse = await getFromCache(`publisher:${args._id}`); // check the cache first
            if (cacheResponse) return cacheResponse;

            const id = returnValidId(args._id);
            const publisher = await getPublisherById(id);
            await addToCache(publisher, `publisher:${args._id}`, -1); // add to cahce with no expiration
            return publisher;
        },
        booksByGenre: async (_, args) => { // genre is an enum in graphql, already valid at this point
            const cacheResponse = await getFromCache(`genre:${args.genre}`); // check the cache first
            if (cacheResponse) return cacheResponse;

            const bookCol = await bookCollection();
            const genreBooks = await bookCol.find({ genre: args.genre }).toArray();
            if (!genreBooks)
                throw new GraphQLError(`Could not fetch books with genre matching '${args.genre}`, { extensions: { code: "NOT_FOUND" } });
            await addToCache(genreBooks, `genre:${args.genre}`, -1); // add to cahce with no expiration
            return genreBooks;
        },
        publishersByEstablishedYear: async (_, args) => { // min/max are ints in graphql, already valid number type at this point
            const min = args.min;
            const max = args.max;
            const currYear = (new Date()).getFullYear();
            if (max < min || min <= 0 || max > (currYear + 5)) {
                throw new GraphQLError("Invalid min/max values", { extensions: { code: "BAD_USER_INPUT" } });
            }

            const cacheResponse = await getFromCache(`foundedYear:${min}:${max}`); // check the cache first
            if (cacheResponse) return cacheResponse;

            const publisherCol = await publisherCollection();
            const allPublishers = await publisherCol.find({ establishedYear: { $gt: args.min, $lt: args.max } }).toArray();
            if (!allPublishers)
                throw new GraphQLError("Could not fetch publishers", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            await addToCache(allPublishers, `foundedYear:${min}:${max}`, -1); // add to cahce with no expiration
            return allPublishers;
        },
        searchAuthorByName: async (_, args) => {
            args.searchTerm = args.searchTerm.trim();
            if (args.searchTerm.length === 0) throw new GraphQLError("Cannot search with an empty string", { extensions: { code: "BAD_USER_INPUT" } });

            const cacheResponse = await getFromCache(`search:author:${args.searchTerm}`); // check the cache first
            if (cacheResponse) return cacheResponse;

            const reSearch = new RegExp(`.*${args.searchTerm}.*`, "gi"); // matches when searchTerm appears anywhere in the string (case insensitive)
            const authorCol = await authorCollection();
            const results = await authorCol.find({ name: reSearch }).toArray();
            if (!results)
                throw new GraphQLError(`Could not find any authors matching '${args.searchTerm}'`, { extensions: { code: "NOT_FOUND" } });
            await addToCache(results, `search:author:${args.searchTerm}`, -1); // add to cahce with no expiration
            return results;
        },
        searchBookByTitle: async (_, args) => {
            args.searchTerm = args.searchTerm.trim();
            if (args.searchTerm.length === 0) throw new GraphQLError("Cannot search with an empty string", { extensions: { code: "BAD_USER_INPUT" } });
            const reSearch = new RegExp(`.*${args.searchTerm}.*`, "gi"); // matches when searchTerm appears anywhere in the string (case insensitive)
            const bookCol = await bookCollection();
            const results = await bookCol.find({ title: reSearch }).toArray();
            if (!results)
                throw new GraphQLError(`Could not find any books matching '${args.searchTerm}'`, { extensions: { code: "NOT_FOUND" } });
            return results;
        },
        getChapterById: async (_, args) => {
            args._id = args._id.trim();
            const id = returnValidId(args._id);
            const chapter = await getChapterById(id);
            return chapter;
        },
        getChaptersByBookId: async (_, args) => {
            args._id = args._id.trim();
            const id = returnValidId(args._id);
            const chapterCol = await chapterCollection();
            const results = await chapterCol.find({ bookId: id }).toArray(); // get chapters with matching book id
            if (!results)
                throw new GraphQLError(`Couldn't find any chapters within book ${args._id}`, { extensions: { code: "NOT_FOUND" } });
            return results;
        },
        searchChapterByTitle: async (_, args) => {
            args.searchTitleTerm = args.searchTitleTerm.trim();
            if (args.searchTitleTerm.length === 0) throw new GraphQLError("Cannot search with an empty string", { extensions: { code: "BAD_USER_INPUT" } });
            const reSearch = new RegExp(`.*${args.searchTitleTerm}.*`, "gi"); // matches when searchTitleTerm appears anywhere in the string (case insensitive)
            const chapterCol = await chapterCollection();
            const results = await chapterCol.find({ title: reSearch }).toArray();
            if (!results)
                throw new GraphQLError(`Could not find any chapters matching '${args.searchTitleTerm}'`, { extensions: { code: "NOT_FOUND" } });
            return results;
        }
    },
    Author: {
        books: async (parentValue) => {
            const id = returnValidId(parentValue._id);
            const bookCol = await bookCollection();
            const booksByAuthor = await bookCol.find({ authorId: id }).toArray(); // query books with an author id equal to that of the current author
            if (!booksByAuthor)
                throw new GraphQLError(`No books found for author with id '${id}'`, { extensions: { code: "NOT_FOUND" } });
            return booksByAuthor;
        },
        numOfBooks: async (parentValue) => {
            const id = returnValidId(parentValue._id);
            const bookCol = await bookCollection();
            const countBooksByAuthor = await bookCol.find({ authorId: id }).toArray();
            if (!countBooksByAuthor)
                throw new GraphQLError(`No books found for author with id '${id}'`, { extensions: { code: "NOT_FOUND" } });
            return countBooksByAuthor.length;
        }
    },
    Book: {
        author: async (parentValue) => {
            const authorId = returnValidId(parentValue.authorId);
            const author = await getAuthorById(authorId);
            return author;
        },
        publisher: async (parentValue) => {
            const publisherId = returnValidId(parentValue.publisherId);
            const publisher = await getPublisherById(publisherId);
            return publisher;
        },
        chapters: async (parentValue) => {
            const bookId = returnValidId(parentValue._id);
            const chapterCol = await chapterCollection();
            const results = await chapterCol.find({ bookId: bookId }).toArray(); // get chapters with matching book id
            if (!results)
                throw new GraphQLError(`Couldn't find any chapters within book ${args._id}`, { extensions: { code: "NOT_FOUND" } });
            return results;
        }
    },
    Publisher: {
        books: async (parentValue) => {
            const id = returnValidId(parentValue._id);
            const bookCol = await bookCollection();
            const booksByPublisher = await bookCol.find({ publisherId: id }).toArray(); // query books with an publisher id equal to that of the current publisher
            if (!booksByPublisher)
                throw new GraphQLError(`No books found for publisher with id '${id}'`, { extensions: { code: "NOT_FOUND" } });
            return booksByPublisher;
        },
        numOfBooks: async (parentValue) => {
            const id = returnValidId(parentValue._id);
            const bookCol = await bookCollection();
            const countBooksByPublisher = await bookCol.find({ publisherId: id }).toArray();
            if (!countBooksByPublisher)
                throw new GraphQLError(`No books found for publisher with id '${id}'`, { extensions: { code: "NOT_FOUND" } });
            return countBooksByPublisher.length;
        }  
    },
    Chapter: {
        book: async (parentValue) => {
            const bookId = returnValidId(parentValue.bookId);
            const book = getBookById(bookId)
            return book;
        }
    },
    Mutation: {
        addAuthor: async (_, args) => {
            let { name, bio, dateOfBirth } = args; // extract fields from args (bio might be undefined, since optional)

            if (bio === null) bio = undefined; // set null (if passed as null in apollo) to undefined, so we can ignore it

            name = name.trim();
            if (name.length === 0) throw new GraphQLError("Empty name provided", { extensions: { code: "BAD_USER_INPUT" } });
            if (bio !== undefined) {
                bio = bio.trim();
                if (bio.length === 0) throw new GraphQLError("Empty bio provided", { extensions: { code: "BAD_USER_INPUT" } });
            }
            dateOfBirth = valiDate(dateOfBirth);

            const authorCol = await authorCollection();
            const insertedInfo = await authorCol.insertOne({ name, bio, dateOfBirth, books: [] }); 
            if (!insertedInfo.acknowledged || !insertedInfo.insertedId)
                throw new GraphQLError("Could not insert author into the database", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            const insertedAuthor = await getAuthorById(insertedInfo.insertedId); // get the author as it was inserted in the database

            await addToCache(insertedAuthor, `author:${insertedAuthor._id.toString()}`, -1); // add new author to cache
            await updateListIfPresent("authors"); // refresh the author list in the cache so it includes the new author
            await updateAuthorSearches(); // update all searches

            return insertedAuthor;
        },
        editAuthor: async (_, args) => {
            let { _id, name, bio, dateOfBirth } = args; // extract fields from args (all except id might be optional)

            if (name === null) name = undefined; // set null (if passed as null in apollo) to undefined, so we can ignore it
            if (bio === null) bio = undefined;
            if (dateOfBirth === null) dateOfBirth = undefined;

            const id = returnValidId(_id);
            if (name === undefined && bio === undefined && dateOfBirth === undefined)
                throw new GraphQLError("No fields provided to update", { extensions: { code: "BAD_USER_INPUT" } });
            if (name !== undefined) {
                name = name.trim();
                if (name.length === 0) throw new GraphQLError("Empty name provided", { extensions: { code: "BAD_USER_INPUT" } });
            }
            if (bio !== undefined) {
                bio = bio.trim();
                if (bio.length === 0) throw new GraphQLError("Empty bio provided", { extensions: { code: "BAD_USER_INPUT" } });
            }
            if (dateOfBirth !== undefined) {
                dateOfBirth = valiDate(dateOfBirth);
            }

            const authorCol = await authorCollection();
            const updateInfo = await authorCol.updateOne({ _id: id }, { $set: { name, bio, dateOfBirth } }, { ignoreUndefined: true }); // don't update a field if it is undefined 
            if (!updateInfo.acknowledged || updateInfo.matchedCount === 0)
                throw new GraphQLError(`Could not edit author with id '${id}'`, { extensions: { code: updateInfo.matchedCount === 0 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR" } }); // not found if the update filter didn't match any docs
            const insertedAuthor = await getAuthorById(id); // get the author

            await updateKeyIfPresent(insertedAuthor, `author:${insertedAuthor._id.toString()}`, -1); // update the author if in the cache
            await updateListIfPresent("authors"); // refresh the author list in the cache so it includes the updated author
            await updateAuthorSearches(); // update all searches

            return insertedAuthor;
        },
        removeAuthor: async (_, args) => {
            const id = returnValidId(args._id);
            const authorCol = await authorCollection();
            const author = await getAuthorById(id);

            for (let i = 0; i < author.books.length; i++) { // remove all books from this author, from the books collection and from its publisher
                _ = await removeBookFromDatabase(author.books[i], "author");
            }

            const deleteInfo = await authorCol.deleteOne({ _id: id });
            if (!deleteInfo || !deleteInfo.acknowledged || deleteInfo.deletedCount !== 1) 
                throw new GraphQLError(`Could not delete author with id '${args._id}'`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });

            await removeFromCacheIfPresent(`author:${id.toString()}`); // bye bye!
            await updateListIfPresent("authors"); // refresh the author list in the cache so it includes the new author
            await updateAuthorSearches(); // update all searches

            return author;
        },
        addPublisher: async (_, args) => {
            let { name, establishedYear, location } = args; // extract fields from args (none optional here)
            
            name = name.trim();
            if (name.length === 0) throw new GraphQLError("Empty name provided", { extensions: { code: "BAD_USER_INPUT" } });
            
            const currYear = (new Date()).getFullYear();
            if (establishedYear <= 0 || establishedYear > (currYear + 5)) {
                throw new GraphQLError(`Invalid established year '${establishedYear}'`, { extensions: { code: "BAD_USER_INPUT" } });
            }

            location = location.trim();
            if (location.length === 0) throw new GraphQLError("Empty location provided", { extensions: { code: "BAD_USER_INPUT" } });

            const publisherCol = await publisherCollection();
            const insertedInfo = await publisherCol.insertOne({ name, establishedYear, location, books: [] }); 
            if (!insertedInfo.acknowledged || !insertedInfo.insertedId)
                throw new GraphQLError("Could not insert publisher into the database", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            const insertedPublisher = await getPublisherById(insertedInfo.insertedId); // get the book as it was inserted in the database

            await addToCache(insertedPublisher, `publisher:${insertedPublisher._id.toString()}`, -1); // add new publisher to cache
            await updateListIfPresent("publishers"); // refresh the publisher list in the cache so it includes the new publisher
            await updateFoundedYearResults(); // update range results

            return insertedPublisher;
        },
        editPublisher: async (_, args) => {
            let { _id, name, establishedYear, location } = args; // extract fields from args (all except id might be optional)

            if (name === null) name = undefined; // set null (if passed as null in apollo) to undefined, so we can ignore it
            if (establishedYear === null) establishedYear = undefined;
            if (location === null) location = undefined;

            const id = returnValidId(_id);
            if (name === undefined && establishedYear === undefined && location === undefined)
                throw new GraphQLError("No fields provided to update", { extensions: { code: "BAD_USER_INPUT" } });
            if (name !== undefined) {
                name = name.trim();
                if (name.length === 0) throw new GraphQLError("Empty name provided", { extensions: { code: "BAD_USER_INPUT" } });
            }
            if (establishedYear !== undefined) {
                const currYear = (new Date()).getFullYear();
                if (establishedYear <= 0 || establishedYear > (currYear + 5)) 
                    throw new GraphQLError(`Invalid established year '${establishedYear}'`, { extensions: { code: "BAD_USER_INPUT" } });
            }
            if (location !== undefined) {
                location = location.trim();
                if (location.length === 0) throw new GraphQLError("Empty location provided", { extensions: { code: "BAD_USER_INPUT" } });
            }

            const publisherCol = await publisherCollection();
            const updateInfo = await publisherCol.updateOne({ _id: id }, { $set: { name, establishedYear, location } }, { ignoreUndefined: true }); // don't update a field if it is undefined 
            if (!updateInfo.acknowledged || updateInfo.matchedCount === 0)
                throw new GraphQLError(`Could not edit publisher with id '${id}'`, { extensions: { code: updateInfo.matchedCount === 0 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR" } }); // not found if the update filter didn't match any docs
            const insertedPublisher = await getBookById(id); // get the publisher

            await updateKeyIfPresent(insertedPublisher, `publisher:${insertedPublisher._id.toString()}`, -1); // update the publisher if in the cache
            await updateListIfPresent("publishers"); // refresh the publisher list in the cache so it includes the updated publisher
            await updateFoundedYearResults(); // update range results

            return insertedPublisher;
        },
        removePublisher: async (_, args) => {
            const id = returnValidId(args._id);
            const publisherCol = await publisherCollection();
            const publisher = await getPublisherById(id);

            for (let i = 0; i < publisher.books.length; i++) { // remove all books from this publisher, from the books collection and from its author
                _ = await removeBookFromDatabase(publisher.books[i], "publisher");
            }

            const deleteInfo = await publisherCol.deleteOne({ _id: id });
            if (!deleteInfo || !deleteInfo.acknowledged || deleteInfo.deletedCount !== 1) 
                throw new GraphQLError(`Could not delete publisher with id '${args._id}'`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });

            await removeFromCacheIfPresent(`publisher:${id.toString()}`); // bye bye!
            await updateListIfPresent("publishers"); // refresh the publisher list in the cache so it includes the new publisher
            await updateFoundedYearResults(); // update range results

            return publisher;
        },
        addBook: async (_, args) => {
            let { title, publicationDate, genre, authorId, publisherId } = args; // extract fields from args (none optional here)
            
            title = title.trim();
            if (title.length === 0) throw new GraphQLError("Empty title provided", { extensions: { code: "BAD_USER_INPUT" } });
            
            publicationDate = valiDate(publicationDate);

            authorId = returnValidId(authorId);
            publisherId = returnValidId(publisherId);
            // ensure that author and publisher exist
            _ = await getAuthorById(authorId);
            _ = await getPublisherById(publisherId);
        
            // insert book and get id
            const bookCol = await bookCollection();
            const insertedInfo = await bookCol.insertOne({ title, publicationDate, genre, authorId, publisherId }); 
            if (!insertedInfo.acknowledged || !insertedInfo.insertedId)
                throw new GraphQLError("Could not insert book into the database", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            const insertedBook = await getBookById(insertedInfo.insertedId); // get the book as it was inserted in the database

            // add to author list
            const authorCol = await authorCollection();
            const updateAuthor = await authorCol.updateOne({ _id: authorId }, { $push: { books: insertedBook._id } });
            if (!updateAuthor.acknowledged || updateAuthor.matchedCount === 0)
                throw new GraphQLError(`Could not edit author with id '${authorId}'`, { extensions: { code: updateAuthor.matchedCount === 0 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR" } }); // not found if the update filter didn't match any docs
            const newAuthor = await getAuthorById(authorId);
            await updateKeyIfPresent(newAuthor, `author:${authorId.toString()}`); // update author in the cache

            // add to publisher list
            const publisherCol = await publisherCollection();
            const updatePublisher = await publisherCol.updateOne({ _id: publisherId }, { $push: { books: insertedBook._id } });
            if (!updatePublisher.acknowledged || updatePublisher.matchedCount === 0)
                throw new GraphQLError(`Could not edit publisher with id '${publisherId}'`, { extensions: { code: updatePublisher.matchedCount === 0 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR" } }); // not found if the update filter didn't match any docs
            const newPublisher = await getPublisherById(publisherId);
            await updateKeyIfPresent(newPublisher, `publisher:${publisherId.toString()}`); // update publisher in the cache

            await addToCache(insertedBook, `book:${insertedBook._id.toString()}`, -1); // add new book to cache
            await updateListIfPresent("books"); // refresh the book list in the cache so it includes the new book
            await updateGenreIfPresent(insertedBook.genre); // update the genre list of this book's genre

            return insertedBook; // phew!
        },
        editBook: async (_, args) => {
            let { _id, title, publicationDate, genre, chapters, authorId, publisherId } = args; // extract fields from args (all except id might be optional)
            const id = returnValidId(_id);

            if (title === null) title = undefined; // set null (if passed as null in apollo) to undefined, so we can ignore it
            if (publicationDate === null) publicationDate = undefined;
            if (genre === null) genre = undefined;
            if (chapters === null) chapters = undefined;
            if (authorId === null) authorId = undefined;
            if (publisherId === null) publisherId = undefined;

            if (title === undefined && publicationDate === undefined && genre === undefined && chapters === undefined && authorId === undefined && publisherId === undefined)
                throw new GraphQLError("No fields provided to update", { extensions: { code: "BAD_USER_INPUT" } });
            
            if (title !== undefined) {
                title = title.trim();
                if (title.length === 0) throw new GraphQLError("Empty title provided", { extensions: { code: "BAD_USER_INPUT" } });
            }
            if (publicationDate !== undefined) {
                publicationDate = valiDate(publicationDate);
            }
            if (chapters !== undefined) {
                for (let i = 0; i < chapters.length; i++) {
                    chapters[i] = returnValidId(chapters[i]);
                    _ = await getChapterById(chapters[i]);
                }
            }
            if (authorId !== undefined) {
                authorId = returnValidId(authorId);
                _ = await getAuthorById(authorId);
            }
            if (publisherId !== undefined) {
                publisherId = returnValidId(publisherId);
                _ = await getPublisherById(publisherId);
            }

            const oldBook = await getBookById(id);

            const bookCol = await bookCollection();
            const updateInfo = await bookCol.updateOne({ _id: id }, { $set: { title, publicationDate, genre, chapters, authorId, publisherId } }, { ignoreUndefined: true }); // don't update a field if it is undefined 
            if (!updateInfo.acknowledged || updateInfo.matchedCount === 0)
                throw new GraphQLError(`Could not edit book with id '${id}'`, { extensions: { code: updateInfo.matchedCount === 0 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR" } }); // not found if the update filter didn't match any docs
            const insertedBook = await getBookById(id); // get the book

            if (authorId !== undefined) {
                const authorCol = await authorCollection();

                const removeAuth = await authorCol.updateOne({ _id: oldBook.authorId }, { $pull: { books: id } });
                if (!removeAuth.acknowledged || removeAuth.matchedCount === 0)
                    throw new GraphQLError(`Could not edit author with id '${oldBook.authorId}'`, { extensions: { code: removeAuth.matchedCount === 0 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR" } }); // not found if the update filter didn't match any docs
                const newRemovedAuth = await getAuthorById(oldBook.authorId);
                await updateKeyIfPresent(newRemovedAuth, `author:${newRemovedAuth._id.toString()}`, -1); // update the author in the cache
                
                const addAuth = await authorCol.updateOne({ _id: authorId }, { $push: { books: id } });
                if (!addAuth.acknowledged || addAuth.matchedCount === 0)
                    throw new GraphQLError(`Could not edit author with id '${authorId}'`, { extensions: { code: addAuth.matchedCount === 0 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR" } }); // not found if the update filter didn't match any docs
                const newAddedAuth = await getAuthorById(authorId);
                await updateKeyIfPresent(newAddedAuth, `author:${newAddedAuth._id.toString()}`, -1); // update the author in the cache

                await updateListIfPresent("authors"); // refresh the author list in the cache so it includes the updated author
            }

            if (publisherId !== undefined) {
                const publisherCol = await publisherCollection();

                const removePub = await publisherCol.updateOne({ _id: oldBook.publisherId }, { $pull: { books: id } });
                if (!removePub.acknowledged || removePub.matchedCount === 0)
                    throw new GraphQLError(`Could not edit publisher with id '${oldBook.publisherId}'`, { extensions: { code: removePub.matchedCount === 0 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR" } }); // not found if the update filter didn't match any docs
                const newRemovedPub = await getPublisherById(oldBook.publisherId);
                await updateKeyIfPresent(newRemovedPub, `publisher:${newRemovedPub._id.toString()}`, -1); // update the publisher in the cache

                const addPub = await publisherCol.updateOne({ _id: publisherId }, { $push: { books: id } });
                if (!addPub.acknowledged || addPub.matchedCount === 0)
                    throw new GraphQLError(`Could not edit publisher with id '${publisherId}'`, { extensions: { code: addPub.matchedCount === 0 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR" } }); // not found if the update filter didn't match any docs
                const newAddedPub = await getPublisherById(publisherId);
                await updateKeyIfPresent(newAddedPub, `publisher:${newAddedPub._id.toString()}`, -1); // update the publisher in the cache

                await updateListIfPresent("publishers"); // refresh the publisher list in the cache so it includes the updated publisher
            }

            if (genre !== undefined) await updateGenreIfPresent(insertedBook.genre); // update genre list if the genre is changed

            await updateKeyIfPresent(insertedBook, `book:${insertedBook._id.toString()}`, -1); // update the book if in the cache
            await updateListIfPresent("books"); // refresh the book list in the cache so it includes the updated book

            return insertedBook; // holy shit this sucks!
        },
        removeBook: async (_, args) => {
            const id = returnValidId(args._id);
            const removedBook = await removeBookFromDatabase(id, "none"); // "none" -> nothing has been removed yet, must remove from author/publisher databases
            return removedBook;
        },
        addChapter: async (_, args) => {
            // TODO
        },
        editChapter: async (_, args) => {
            // TODO
        },
        removeChapter: async (_, args) => {
            // TODO
        }
    }
};
