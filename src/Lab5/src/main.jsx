import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

import App from "./App";
import NotFound from "./NotFound";
import Page from "./Page";
import Event from "./Event";
import Attraction from "./Attraction";
import Venue from "./Venue";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/events/page/:page" element={<Page type="events" />} />
                <Route path="/events/:id" element={<Event />} />
                <Route path="/attractions/page/:page" element={<Page type="attractions" />} />
                <Route path="/attractions/:id" element={<Attraction />} />
                <Route path="/venues/page/:page" element={<Page type="venues" />} />
                <Route path="/venues/:id" element={<Venue />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
