import { Router } from "express";
import redis from "redis";

import pokeData from "../data/index.js";
import { validateRedisResponse, validateRedisListResponse, returnValidInt } from "../helpers.js";

const router = Router();
const cache = redis.createClient();
await cache.connect();

router.route("/").get(async (req, res) => {
    try {
        const data = await pokeData.getAllPokemon();
        validateRedisResponse(await cache.json.set("PK_ALL", "$", data)); // second arg is json path ($ = set at root)
        return res.json(data); // return the data!
    } catch (e) {
        return res.status(500).json({ error: "could not fetch pokemon data", msg: JSON.stringify(e) });
    }
});

router.route("/history").get(async (req, res) => {
    const cacheResponse = await cache.lRange(`PK_HISTORY`, 0, 24); // get 25 most recent items from the list (returns empty array if empty, no out-of-range error)
    try {
        const responseAsObjects = cacheResponse.map((elem) => JSON.parse(elem)); // parse all elements to JSON
        return res.json(responseAsObjects); // return the history!
    } catch (e) {
        return res.status(500).json({ error: "couldn't parse history", msg: JSON.stringify(e) });
    }
});

router.route("/:id").get(async (req, res) => {
    let id = req.params.id;
    try {
        id = returnValidInt(id);
    } catch (e) {
        return res.status(400).json({ error: "could not parse id", msg: JSON.stringify(e) });
    }
    try {
        const data = await pokeData.getPokemon(id);
        validateRedisListResponse(await cache.lPush(`PK_HISTORY`, JSON.stringify(data))); // stringify to use redis lists (which can only hold strings)
        validateRedisResponse(await cache.json.set(`PK_${id}`, "$", data));
        return res.json(data);
    } catch (e) {
        return res.status(404).json({ error: `could not find pokemon with id ${id}`, msg: JSON.stringify(e) });
    }
});


export default router;
