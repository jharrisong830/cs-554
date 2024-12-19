import { Router } from "express";
import { movieData } from "../data/index.js";
import vld from "../helpers.js";

const router = Router();

router
    .route("/movies")
    .get(async (req, res) => {
        // done!
        const options = req.query;
        try {
            let n = options.take ? parseInt(options.take) : 20; // default: 20
            let offset = options.skip ? parseInt(options.skip) : 0; // default: 0
            if (isNaN(n) || isNaN(offset)) {
                return res.status(400).json({
                    error: "cloudn't get movies",
                    msg: "ERROR: couldn't parse options to int"
                });
            }
            const results = await movieData.getN(n, offset);
            return res.json(results);
        } catch (e) {
            return res
                .status(500)
                .json({ error: "couldn't get movies", msg: JSON.stringify(e) });
        }
    })
    .post(async (req, res) => {
        // done!
        let newMovieData = req.body;
        try {
            // validate the movie params
            newMovieData = vld.validateMovieParams(
                newMovieData.title,
                newMovieData.cast,
                newMovieData.info,
                newMovieData.plot,
                newMovieData.rating
            );
        } catch (e) {
            return res.status(400).json({
                error: "couldn't create movie",
                msg: JSON.stringify(e)
            });
        }
        try {
            const insertedMovie = await movieData.createMovie(
                newMovieData.title,
                newMovieData.cast,
                newMovieData.info,
                newMovieData.plot,
                newMovieData.rating
            );
            return res.json(insertedMovie);
        } catch (e) {
            return res.status(500).json({
                error: "couldn't create movie",
                msg: JSON.stringify(e)
            });
        }
    });

router
    .route("/movies/:id")
    .get(async (req, res) => {
        // done!
        try {
            const result = await movieData.getMovie(req.params.id); // get requested movie (this function will validate movie id and throw if its invalid/not found)
            return res.json(result);
        } catch (e) {
            return res.status(404).json({
                error: "couldn't find movie movie",
                msg: JSON.stringify(e)
            });
        }
    })
    .put(async (req, res) => {
        // done!
        let updateMovieData = req.body;
        try {
            // validate the movie params, throw 400 if invalid
            updateMovieData = vld.validateMovieParams(
                updateMovieData.title,
                updateMovieData.cast,
                updateMovieData.info,
                updateMovieData.plot,
                updateMovieData.rating
            );
        } catch (e) {
            return res.status(400).json({
                error: "couldn't update movie",
                msg: JSON.stringify(e)
            });
        }
        try {
            const result = await movieData.putMovie(
                req.params.id,
                updateMovieData
            ); // get the result of updating the movie (this func validates the request body and checks that the movie exists)
            return res.json(result);
        } catch (e) {
            return res.status(404).json({
                error: "couldn't update movie",
                msg: JSON.stringify(e)
            });
        }
    })
    .patch(async (req, res) => {
        // done!
        let updateMovieData = req.body;
        try {
            // check for invalid input (one-by-one, unfortunately)
            if (updateMovieData.title)
                updateMovieData.title = vld.returnValidString(
                    updateMovieData.title
                );
            if (updateMovieData.cast)
                updateMovieData.cast = vld.validateCast(updateMovieData.cast);
            if (updateMovieData.info) {
                // this can have nested fields, so we need to check them individually
                if (updateMovieData.info.director)
                    updateMovieData.info.director = vld.returnValidString(
                        updateMovieData.info.director
                    );
                if (updateMovieData.info.yearReleased)
                    updateMovieData.info.yearReleased = vld.validateInfoYear(
                        updateMovieData.info.yearReleased
                    );
            }
            if (updateMovieData.plot)
                updateMovieData.plot = vld.returnValidString(
                    updateMovieData.plot
                );
            if (updateMovieData.rating)
                updateMovieData.rating = vld.validateRating(
                    updateMovieData.rating
                );
        } catch (e) {
            return res.status(400).json({
                error: "couldn't update movie",
                msg: JSON.stringify(e)
            });
        }
        try {
            const result = await movieData.patchMovie(
                req.params.id,
                updateMovieData
            ); // get the result of updating the movie (this func validates the request body and checks that the movie exists)
            return res.json(result);
        } catch (e) {
            return res.status(404).json({
                error: "couldn't update movie",
                msg: JSON.stringify(e)
            });
        }
    });

router.route("/movies/:id/comments").post(async (req, res) => {
    // done!
    let newCommentData = req.body;
    try {
        newCommentData = vld.validateCommentParams(
            newCommentData.name,
            newCommentData.comment
        );
    } catch (e) {
        return res
            .status(400)
            .json({ error: "couldn't submit comment", msg: JSON.stringify(e) });
    }
    try {
        const result = await movieData.createComment(
            req.params.id,
            newCommentData.name,
            newCommentData.comment
        ); // again, all params will be validated in this method, will throw if anything is invalid
        return res.json(result);
    } catch (e) {
        return res
            .status(404)
            .json({ error: "couldn't submit comment", msg: JSON.stringify(e) });
    }
});

router.route("/movies/:movieId/:commentId").delete(async (req, res) => {
    // TODO
    try {
        const result = await movieData.deleteComment(
            req.params.movieId,
            req.params.commentId
        );
        return res.json(result);
    } catch (e) {
        return res
            .status(404)
            .json({ error: "couldn't delete comment", msg: JSON.stringify(e) });
    }
});

export default router;
