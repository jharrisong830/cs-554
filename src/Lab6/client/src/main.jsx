import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

import App from "./App";
import DataList from "./DataList";
import Book from "./Book";
import Author from "./Author";
import Publisher from "./Publisher";
import Search from "./Search";
import NotFound from "./NotFound";

import * as resolvers from "../resolvers";

import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloProvider
} from "@apollo/client";
import { Route, Routes, BrowserRouter, Link } from "react-router-dom";


const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: "http://localhost:4000"
    })
});

createRoot(document.getElementById("root")).render(
    <ApolloProvider client={client}>
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />

                    <Route path="/authors" element={<DataList type="authors" query={resolvers.GET_AUTHORS_LIST} />} />
                    <Route path="/books" element={<DataList type="books" query={resolvers.GET_BOOKS_LIST} />} />
                    <Route path="/publishers" element={<DataList type="publishers" query={resolvers.GET_PUBLISHERS_LIST} />} />

                    <Route path="/books/:id" element={<Book />} />
                    <Route path="/authors/:id" element={<Author />} />
                    <Route path="/publishers/:id" element={<Publisher />} />

                    <Route path="/search" element={<Search />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Link to="/">Back to Home</Link>
            </BrowserRouter>
        </StrictMode>
    </ApolloProvider>
);
