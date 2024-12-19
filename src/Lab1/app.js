import express from "express";
import routesConfig from "./routes/index.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// middleware functions
let totalRequests = 0;
let urlRequestMap = {}; // dictionary of url -> number of times requested

// count total requests to the server
app.use("/", (req, res, next) => {
    // '/' applies to all routes under the root route
    totalRequests++;
    next(); // fall through to the next middleware
});

// log all request bodies, paths, http verbs
app.use("/", (req, res, next) => {
    console.log(`Request Body:\n${JSON.stringify(req.body)}`);
    console.log(`Requested Path: '${req.originalUrl}'`);
    console.log(`Requested HTTP Method: '${req.method}'`);
    console.log(); // newline before next log statement

    next(); // fall through to the next middleware
});

// count and log the amount of times a url is requested
app.use("/", (req, res, next) => {
    if (Object.keys(urlRequestMap).includes(req.originalUrl)) {
        urlRequestMap[req.originalUrl]++; // increment the counter for this url if it exists in the dictionary...
    } else {
        // ...else, put it in the dict. with a value of 1
        urlRequestMap[req.originalUrl] = 1;
    }

    console.log(
        `'${req.originalUrl}'\nRoute Requests: ${urlRequestMap[req.originalUrl]}`
    );
    console.log(`TOTAL REQUESTS: ${totalRequests}`);
    console.log(); // newline before next log statement

    next(); // fall through to the next middleware
});

routesConfig(app); // configure routes after middleware (so that they run!)

app.listen(PORT, () => {
    console.log(`Server running @ http://localhost:${PORT}`);
});
