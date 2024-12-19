import apiRoutes from "./api.js";

const constructorMethod = (app) => {
    app.use("/api", apiRoutes);

    app.use("*", (req, res) => {
        // ignore all other endpoints
        res.status(404).json({ error: "route not found!" });
    });
};

export default constructorMethod;
