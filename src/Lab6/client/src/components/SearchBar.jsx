import { useState, useRef } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import {
    BOOKS_BY_GENRE,
    PUBLISHERS_BY_ESTABLISHED_YEAR,
    SEARCH_AUTHOR_BY_NAME,
    SEARCH_BOOK_BY_TITLE
} from "../../resolvers";
import SearchResults from "./SearchResults";

export default function SearchBar() {
    const [searchType, setSearchType] = useState("booksByGenre");
    const [isShowingResults, setIsShowingResults] = useState(false);
    const [currQuery, setCurrQuery] = useState(null);
    const [currParams, setCurrParams] = useState({});

    const searchTypeSelect = useRef();

    const handleSearch = (e) => {
        e.preventDefault();
        setIsShowingResults(false);
        switch (searchType) {
            case "booksByGenre":
                const genre = document.getElementById("genre").value.trim();
                setCurrQuery(BOOKS_BY_GENRE);
                setCurrParams({ genre });
                break;
            case "publishersByEstablishedYear":
                const min = parseInt(
                    document.getElementById("min").value.trim()
                );
                const max = parseInt(
                    document.getElementById("max").value.trim()
                );
                setCurrQuery(PUBLISHERS_BY_ESTABLISHED_YEAR);
                setCurrParams({ min, max });
                break;
            case "searchAuthorByName":
                const name = document.getElementById("searchText").value.trim();
                setCurrQuery(SEARCH_AUTHOR_BY_NAME);
                setCurrParams({ searchTerm: name });
                break;
            case "searchBookByTitle":
                const title = document
                    .getElementById("searchText")
                    .value.trim();
                setCurrQuery(SEARCH_BOOK_BY_TITLE);
                setCurrParams({ searchTerm: title });
                break;
        }
        setIsShowingResults(true);
    };

    const handleChangeSearchType = () => {
        setSearchType(searchTypeSelect.current.value);
        setIsShowingResults(false);
    };

    const getFormControl = () => {
        switch (searchType) {
            case "booksByGenre":
                return (
                    <Form.Select id="genre" required defaultValue="">
                        <option value="" disabled>
                            Choose a genre
                        </option>
                        <option value="FICTION">Fiction</option>
                        <option value="NON_FICTION">Non-fiction</option>
                        <option value="MYSTERY">Mystery</option>
                        <option value="FANTASY">Fantasy</option>
                        <option value="ROMANCE">Romance</option>
                        <option value="SCIENCE_FICTION">Science fiction</option>
                        <option value="HORROR">Horror</option>
                        <option value="BIOGRAPHY">Biography</option>
                    </Form.Select>
                );
            case "publishersByEstablishedYear":
                return (
                    <Form.Group>
                        <Form.Control
                            id="min"
                            type="number"
                            required
                            placeholder="Min year"
                        />
                        <Form.Control
                            id="max"
                            type="number"
                            required
                            placeholder="Max year"
                        />
                    </Form.Group>
                );
            case "searchAuthorByName":
            case "searchBookByTitle":
                return (
                    <Form.Control
                        id="searchText"
                        type="text"
                        required
                        placeholder="Search text"
                    />
                );
        }
    };

    return (
        <div>
            <Form onSubmit={(e) => handleSearch(e)}>
                <InputGroup>
                    {getFormControl()}
                    <Form.Select
                        id="searchType"
                        defaultValue={searchType}
                        ref={searchTypeSelect}
                        onChange={handleChangeSearchType}
                    >
                        <option value="booksByGenre">
                            Search Books by Genre
                        </option>
                        <option value="publishersByEstablishedYear">
                            Search Publishers by Year
                        </option>
                        <option value="searchAuthorByName">
                            Search Authors by Name
                        </option>
                        <option value="searchBookByTitle">
                            Search Books by Title
                        </option>
                    </Form.Select>
                    <Button type="submit">Search</Button>
                </InputGroup>
            </Form>
            {isShowingResults && (
                <SearchResults
                    searchType={searchType}
                    query={currQuery}
                    queryParams={currParams}
                    setIsShowingResults={setIsShowingResults}
                />
            )}{" "}
            {/* pass the setter to allow this component to clear the results */}
        </div>
    );
}
