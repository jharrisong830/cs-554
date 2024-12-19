import express from "express";
import redis from "redis";

import routesConfig from "./routes/index.js";
import { returnValidInt, validateRedisListResponse } from "./helpers.js";

const app = express();
const PORT = 3000;
const cache = redis.createClient();

app.use(express.json());

// middleware configs (checking cache)
app.use("/api/pokemon", async (req, res, next) => {
    if (req.originalUrl !== "/api/pokemon" && req.originalUrl !== "/api/pokemon/") return next(); // skip if this is not the exact route (this will catch everything under /api/pokemon/*)
    console.log(req.originalUrl);
    const cacheResponse = await cache.json.get("PK_ALL"); // check if there is a value for "PK_ALL"
    if (cacheResponse) {
        console.log("Cache hit!");
        return res.json(cacheResponse); // return cached data if so!
    }
    return next(); // fall through!
});

app.use("/api/pokemon/:id", async (req, res, next) => {
    if (req.originalUrl === "/api/pokemon/history" || req.originalUrl === "/api/pokemon/history/") return next(); // treats "history" as id param lmao i hate this
    console.log(req.originalUrl);
    let id = req.params.id; // validate id
    try {
        id = returnValidInt(id);
    } catch (e) {
        return res.status(400).json({ error: "could not parse id", msg: JSON.stringify(e) });
    }
    const cacheResponse = await cache.json.get(`PK_${id}`); // try to find if requested item has a value in the cache
    if (cacheResponse) {
        console.log("Cache hit!");
        validateRedisListResponse(await cache.lPush(`PK_HISTORY`, JSON.stringify(cacheResponse))); // push pokemon to history even if found in cache!
        return res.json(cacheResponse); // return cached data
    }
    return next(); // fall through!
});

app.use("/api/move", async (req, res, next) => { // similar to first middleware, just with moves instead
    if (req.originalUrl !== "/api/move" && req.originalUrl !== "/api/move/") return next(); // skip if this is not the exact route (this will catch everything under /api/move/*)
    console.log(req.originalUrl);
    const cacheResponse = await cache.json.get("MOVE_ALL"); // check if there is a value for "MOVE_ALL"
    if (cacheResponse) {
        console.log("Cache hit!");
        return res.json(cacheResponse); // return cached data if so!
    }
    return next(); // fall through!
});

app.use("/api/move/:id", async (req, res, next) => {
    console.log(req.originalUrl);
    let id = req.params.id; // validate id
    try {
        id = returnValidInt(id);
    } catch (e) {
        return res.status(400).json({ error: "could not parse id", msg: JSON.stringify(e) });
    }
    const cacheResponse = await cache.json.get(`MOVE_${id}`); // try to find if requested item has a value in the cache
    if (cacheResponse) {
        console.log("Cache hit!");
        return res.json(cacheResponse); // return cached data
    }
    return next(); // fall through!
});

app.use("/api/item", async (req, res, next) => { // similar to first middleware, just with ~~moves~~ items instead
    if (req.originalUrl !== "/api/item" && req.originalUrl !== "/api/item/") return next(); // skip if this is not the exact route (this will catch everything under /api/move/*)
    console.log(req.originalUrl);
    const cacheResponse = await cache.json.get("ITEM_ALL"); // check if there is a value for "MOVE_ALL"
    if (cacheResponse) {
        console.log("Cache hit!");
        return res.json(cacheResponse); // return cached data if so!
    }
    return next(); // fall through!
});

app.use("/api/item/:id", async (req, res, next) => {
    console.log(req.originalUrl);
    let id = req.params.id; // validate id
    try {
        id = returnValidInt(id);
    } catch (e) {
        return res.status(400).json({ error: "could not parse id", msg: JSON.stringify(e) });
    }
    const cacheResponse = await cache.json.get(`ITEM_${id}`); // try to find if requested item has a value in the cache
    if (cacheResponse) {
        console.log("Cache hit!");
        return res.json(cacheResponse); // return cached data
    }
    return next(); // fall through!
});


routesConfig(app);

app.listen(PORT, async () => {
    await cache.connect(); // connect to redis cache
    console.log(`Server started @ http://localhost:${PORT}`);
});
