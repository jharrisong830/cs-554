import axios from "axios";

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
 * wrapper function for axios get requests. does the request, validates that the data is defined, and then returns the data
 * @param {string} reqUrl 
 * 
 * @returns {object}
 * @throws on invalid input or error from the requested server
 */
export const returnValidData = async (reqUrl) => {
    reqUrl = returnValidString(reqUrl);
    const { data } = await axios.get(reqUrl);

    if (!data) throw "ERROR: unable to get data from requested url";
    return data;
};

/**
 * validates the response from a redis operation (typically "OK" on success)
 * @param {*} res response from a redis operation
 * 
 * @throws if response is not "OK"
 */
export const validateRedisResponse = (res) => {
    if (typeof res !== "string" || res !== "OK") {
        throw "ERROR: invalid redis response";
    }
};

/**
 * validates the response from a redis list operation (length of list on success)
 * @param {*} res 
 * 
 * @throws if response is not a valid list length
 */
export const validateRedisListResponse = res => {
    if (typeof res !== "number" || res < 0) {
        throw "ERROR: invalid redis list response";
    }
};

/**
 * converts the provided string to a number
 * @param {string} str 
 * 
 * @returns {number}
 * @throws if conversion fails
 */
export const returnValidInt = (str) => {
    str = returnValidString(str);
    const result = parseInt(str);
    if (result === null || result === undefined || typeof result !== "number" || isNaN(result)) {
        throw "ERROR: could not parse to int";
    }
    return result;
};
