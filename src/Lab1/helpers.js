import { ObjectId } from "mongodb";

/**
 * checks that str is of type string, trims it, and returns the trimmed value if not empty
 * @param {*} str value to be validated
 *
 * @returns {string} trimmed, non-empty string
 * @throws if str is not a string, or if str is an empty string after trimming it
 */
export const returnValidString = (str) => {
    if (typeof str !== "string")
        throw `ERROR: value not of type 'string' (got '${typeof str}')`;
    str = str.trim();
    if (str.length === 0) throw "ERROR: provided string is empty";
    return str; // return the string if it passes validation
};

/**
 * validate cast of a movie
 * @param {[object]} cast
 *
 * @returns {[object]}
 * @throws on invalid input
 */
export const validateCast = (cast) => {
    if (!Array.isArray(cast) || cast.length === 0)
        throw "ERROR: expected an array for 'cast' with at least one member";
    for (let i = 0; i < cast.length; i++) {
        // validate each cast member object (that its an object with firstName and lastName fields)
        if (typeof cast[i] !== "object")
            throw `ERROR: expected an object for cast member (got '${typeof cast[i]}')`;
        if (
            !Object.keys(cast[i]).includes("firstName") ||
            !Object.keys(cast[i]).includes("lastName")
        )
            throw "ERROR: cast member object missing 'firstName' or 'lastName' key";
        cast[i]["firstName"] = returnValidString(cast[i]["firstName"]);
        cast[i]["lastName"] = returnValidString(cast[i]["lastName"]);
    }
    return cast;
};

/**
 * validate year of movie info
 * @param {number} year
 *
 * @returns {number}
 * @throws on invalid input
 */
export const validateInfoYear = (year) => {
    if (typeof year !== "number" || year < 0 || year > 2030)
        throw `ERROR: invalid release year value (got '${year}')`;
    return year;
};

/**
 * validate info of a movie
 * @param {object} info
 *
 * @returns {object}
 * @throws on invalid input
 */
export const validateInfo = (info) => {
    if (typeof info !== "object")
        throw `ERROR: expected an object for movie info (got '${typeof info}')`;
    if (
        !Object.keys(info).includes("director") ||
        !Object.keys(info).includes("yearReleased")
    )
        throw "ERROR: info object missing 'director' or 'yearReleased' key";
    info["director"] = returnValidString(info["director"]);
    info["yearReleased"] = validateInfoYear(info["yearReleased"]);
    return info;
};

/**
 * validate rating of a movie
 * @param {number} rating
 *
 * @returns {number}
 * @throws on invalid input
 */
export const validateRating = (rating) => {
    if (typeof rating !== "number" || rating > 5 || rating < 0)
        throw `ERROR: invalid rating value (got '${rating}')`;
    return rating;
};

/**
 * validates types, trims, and returns a movie object (without id)
 * @param {string} title
 * @param {[object]} cast [{firstName: string, lastName: string}, ...]
 * @param {object} info {director: string, yearReleased: number}
 * @param {string} plot
 * @param {number} rating
 *
 * @returns {object} movie object (no id)
 * @throws on invalid input
 */
export const validateMovieParams = (title, cast, info, plot, rating) => {
    title = returnValidString(title); // validation of either strings or other objects (in separate methods)
    plot = returnValidString(plot);
    cast = validateCast(cast);
    info = validateInfo(info);
    rating = validateRating(rating);

    return {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating
    };
};

/**
 * validates types, trims, and returns a comment object
 * @param {string} name
 * @param {string} comment
 *
 * @returns {object} comment object (with id)
 * @throws on invalid input
 */
export const validateCommentParams = (name, comment) => {
    name = returnValidString(name); // string validation
    comment = returnValidString(comment);
    return {
        _id: new ObjectId(),
        name: name,
        comment: comment
    };
};

const validationMethods = {
    returnValidString,
    validateCast,
    validateInfoYear,
    validateInfo,
    validateRating,
    validateMovieParams,
    validateCommentParams
};

export default validationMethods;
