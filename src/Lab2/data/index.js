import { returnValidData } from "../helpers.js";

/**
 * returns data for all pokemon
 * @returns {object} pokemon api response for all pokemon
 * @throws on api error
 */
const getAllPokemon = async () => {
    const data = await returnValidData("https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0"); // get all pokemon (throws error if unable to fetch)
    if (!Object.keys(data).includes("results")) {
        throw "ERROR: unable to get results array"
    }
    return data.results;
};

/**
 * returns data for pokemon specified by id
 * @param {number} id 
 * 
 * @returns {object}
 * @throws on invalid input or api error
 */
const getPokemon = async (id) => {
    const data = await returnValidData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return data;
};

/**
 * returns data for all moves
 * @returns {object} pokemon api response for all moves
 * @throws on api error
 */
const getAllMoves = async () => {
    const data = await returnValidData("https://pokeapi.co/api/v2/move?limit=100000&offset=0");
    if (!Object.keys(data).includes("results")) {
        throw "ERROR: unable to get results array"
    }
    return data.results;
};

/**
 * returns data for move specified by id
 * @param {number} id 
 * 
 * @returns {object}
 * @throws on invalid input or api error
 */
const getMove = async (id) => {
    const data = await returnValidData(`https://pokeapi.co/api/v2/move/${id}`);
    return data;
};

/**
 * returns data for all items
 * @returns {object} pokemon api response for all items
 * @throws on api error
 */
const getAllItems = async () => {
    const data = await returnValidData("https://pokeapi.co/api/v2/item?limit=100000&offset=0");
    if (!Object.keys(data).includes("results")) {
        throw "ERROR: unable to get results array"
    }
    return data.results;
};

/**
 * returns data for item specified by id
 * @param {number} id 
 * 
 * @returns {object}
 * @throws on invalid input or api error
 */
const getItem = async (id) => {
    const data = await returnValidData(`https://pokeapi.co/api/v2/item/${id}`);
    return data;
};



const exportedMethods = {
    getAllPokemon,
    getPokemon,
    getAllMoves,
    getMove,
    getAllItems,
    getItem
};

export default exportedMethods;
