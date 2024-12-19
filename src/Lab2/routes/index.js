import pokeRoutes from "./pokemon.js";
import moveRoutes from "./moves.js";
import itemRoutes from "./items.js";

const routesConfig = (app) => {
    app.use("/api/pokemon", pokeRoutes);
    app.use("/api/move", moveRoutes);
    app.use("/api/item", itemRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({ error: "route not found" });
    });
};

export default routesConfig;
