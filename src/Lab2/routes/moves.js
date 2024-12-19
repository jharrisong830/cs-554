import { Router } from "express";
import redis from "redis";

import pokeData from "../data/index.js";
import { validateRedisResponse, returnValidInt } from "../helpers.js";

const router = Router();
const cache = redis.createClient();
await cache.connect();

router.route("/").get(async (req, res) => {
    try {
        const data = await pokeData.getAllMoves();
        validateRedisResponse(await cache.json.set("MOVE_ALL", "$", data)); // second arg is json path ($ = set at root)
        return res.json(data); // return the data!
    } catch (e) {
        return res
            .status(500)
            .json({ error: "could not fetch moves data", msg: e });
    }
});

router.route("/:id").get(async (req, res) => {
    let id = req.params.id;
    try {
        id = returnValidInt(id);
    } catch (e) {
        return res
            .status(400)
            .json({ error: "could not parse id", msg: JSON.stringify(e) });
    }
    try {
        const data = await pokeData.getMove(id);
        validateRedisResponse(await cache.json.set(`MOVE_${id}`, "$", data));
        return res.json(data);
    } catch (e) {
        return res
            .status(404)
            .json({
                error: `could not find move with id ${id}`,
                msg: JSON.stringify(e)
            });
    }
});

export default router;
