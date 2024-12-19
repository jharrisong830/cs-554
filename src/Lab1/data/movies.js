import {
    returnValidString,
    validateCommentParams,
    validateMovieParams,
    validateCast,
    validateRating,
    validateInfoYear
} from "../helpers.js";
import { movies } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

/**
 * creates a movie in the database and returns the inserted movie object
 * @param {string} title
 * @param {[object]} cast [{firstName: string, lastName: string}, ...]
 * @param {object} info {director: string, yearReleased: number}
 * @param {string} plot
 * @param {number} rating
 *
 * @returns {object} movie object as it is in the database (with id value)
 * @throws on invalid input
 */
const createMovie = async (title, cast, info, plot, rating) => {
    const newMovie = validateMovieParams(title, cast, info, plot, rating); // get validated movie object
    const movieCol = await movies();
    const insertedInfo = await movieCol.insertOne(newMovie);

    if (!insertedInfo.acknowledged || !insertedInfo.insertedId)
        throw "ERROR: unable to insert movie into the database";
    return await getMovie(insertedInfo.insertedId.toString()); // return the newly inserted movie
};

/**
 *
 * @param {string} movieId id of the movie being commented on
 * @param {string} name
 * @param {string} comment
 *
 * @returns {object} newly inserted comment object
 * @throws on invalid input or database error
 */
const createComment = async (movieId, name, comment) => {
    await getMovie(movieId); // check that the movie id is valid and that the movie exists
    const newComment = validateCommentParams(name, comment); // validate the comment params

    const movieCol = await movies();
    const updateInfo = await movieCol.updateOne(
        { _id: new ObjectId(movieId) },
        { $push: { comments: newComment } }
    ); // push the new comment to the movie's comment array
    if (
        !updateInfo ||
        updateInfo.matchedCount === 0 ||
        updateInfo.modifiedCount === 0
    )
        throw "ERROR: unable to update movie comments";
    return newComment;
};

const getComment = async (movieId, commentId) => {
    await getMovie(movieId); // check that movie exists
    commentId = returnValidString(commentId);
    if (!ObjectId.isValid(commentId)) throw "ERROR: invalid id supplied";

    const movieCol = await movies();
    const comment = await movieCol.findOne(
        { _id: new ObjectId(movieId), "comments._id": new ObjectId(commentId) },
        { projection: { _id: 0, "comments.$": 1 } }
    ); // get only the comment with specified id from the specified movie
    if (!comment || comment.comments.length !== 1)
        throw `ERROR: could not fetch comment, or no such comment/movie found`;
    return comment.comments[0]; // return the movie object!
};

const deleteComment = async (movieId, commentId) => {
    await getComment(movieId, commentId); // check that the movie id is valid and that the movie exists, and that the comment exists on the movie

    const movieCol = await movies();
    const updateInfo = await movieCol.updateOne(
        { _id: new ObjectId(movieId) },
        { $pull: { comments: { _id: new ObjectId(commentId) } } }
    ); // remove the comment
    if (
        !updateInfo ||
        updateInfo.matchedCount === 0 ||
        updateInfo.modifiedCount === 0
    )
        throw "ERROR: unable to update movie comments";
    return await getMovie(movieId); // return the movie without the removed comment
};

/**
 * fetches a movie with the provided id from the database
 * @param {string} id
 *
 * @returns {object} movie object from the database
 * @throws if movie is not found, on database error, or on invalid input
 */
const getMovie = async (id) => {
    id = returnValidString(id);
    if (!ObjectId.isValid(id)) throw "ERROR: invalid id supplied";

    const movieCol = await movies();
    const movie = await movieCol.findOne({ _id: new ObjectId(id) }); // find movie with the provided id
    if (!movie)
        throw `ERROR: could not fetch movie, or no such movie found ('${id}')`;
    return movie; // return the movie object!
};

/**
 * fetches a sequence of movies from the database
 * @param {number} n number of movies to return (default: 20, max: 100)
 * @param {number} offset where in the database to start returning movies (default: 0)
 *
 * @returns {[object]} array of movie objects
 * @throws on invalid input or database error
 */
const getN = async (n = 20, offset = 0) => {
    if (typeof n !== "number" || n < 1 || n > 100) {
        throw `ERROR: expected n in range [1, 100], got '${n}'`;
    }
    if (typeof offset !== "number" || offset < 0) {
        throw `ERROR: expected offset in range [0, inf], got '${offset}'`;
    }

    const movieCol = await movies();
    const result = await movieCol
        .find({}, { skip: offset, limit: n }) // supply limit and offset options
        .toArray(); // convert cursor to array of documents

    return result;
};

/**
 * replaces movieId with all new movie details (must provide ALL fields to update)
 * @param {string} movieId
 * @param {object} updateObject contails ALL fields, replaces movie @ movieId with this data
 *
 * @returns {object} updated movie object
 * @throws on invalid input or database error
 */
const putMovie = async (movieId, updateObject) => {
    const { title, cast, info, plot, rating } = updateObject; // unpack all movie properties (all must be present for put)
    if (![title, cast, info, plot, rating].every((elem) => !!elem)) {
        // check that all have a value (!! double negates, essentially casts something to its boolean value)
        throw `ERROR: missing one or more properties for put request (got this object: ${JSON.stringify(updateObject)})`;
    }

    let currMovie = await getMovie(movieId); // get the current state of the movie (this will check that the id is valid and that the movie exists)
    movieId = currMovie._id; // get the objectid

    const newMovie = validateMovieParams(title, cast, info, plot, rating); // validate all fields and get a new movie object

    const movieCol = await movies();
    const updateInfo = await movieCol.updateOne(
        { _id: movieId },
        { $set: newMovie }
    );
    if (!updateInfo || updateInfo.matchedCount === 0)
        throw "ERROR: unable to update movie";
    return await getMovie(movieId.toString()); // return the newly updated movie!
};

/**
 * updates movieId with the provided fields in updateObject
 * @param {string} movieId
 * @param {object} updateObject
 *
 * @returns {object} updated movie object
 * @throws on invalid input or database error
 */
const patchMovie = async (movieId, updateObject) => {
    let { title, cast, info, plot, rating } = updateObject; // unpack all movie properties
    if (![title, cast, info, plot, rating].some((elem) => !!elem)) {
        // ensure that there is at least one defined property
        throw `ERROR: missing all properties for patch request (got this object: ${JSON.stringify(updateObject)})`;
    }

    let currMovie = await getMovie(movieId); // get the current state of the movie (this will check that the id is valid and that the movie exists)
    movieId = currMovie._id; // get the objectid

    let newMovie = {}; // start constructing a new movie payload
    if (title) newMovie.title = returnValidString(title);
    if (cast) newMovie.cast = validateCast(cast);
    if (info) {
        // this can have nested fields, so we need to check them individually
        newMovie.info = {};
        if (info.director)
            newMovie.info.director = returnValidString(info.director);
        if (info.yearReleased)
            newMovie.info.yearReleased = validateInfoYear(info.yearReleased);
    }
    if (plot) newMovie.plot = returnValidString(plot);
    if (rating) newMovie.rating = validateRating(rating);

    const movieCol = await movies();
    const updateInfo = await movieCol.updateOne(
        { _id: movieId },
        { $set: newMovie }
    );
    if (!updateInfo || updateInfo.matchedCount === 0)
        throw "ERROR: unable to update movie";
    return await getMovie(movieId.toString()); // return the newly updated movie!
};

const exportedMethods = {
    createMovie,
    getMovie,
    getN,
    createComment,
    deleteComment,
    putMovie,
    patchMovie
};

export default exportedMethods;
