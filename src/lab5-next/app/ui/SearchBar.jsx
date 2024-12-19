import { useState, useRef } from "react";
import { Form, FormControl, Button, InputGroup } from "react-bootstrap";
import SearchResults from "@/app/ui/SearchResults";

export default function SearchBar({ type }) {
    const [searchText, setSearchText] = useState("");
    const [isShowingResults, setIsShowingResults] = useState(false);
    const searchBox = useRef();

    const handleSearch = (e) => {
        e.preventDefault();
        setIsShowingResults(false);
        const searchTextCurrent = searchBox.current.value.trim();
        if (searchTextCurrent.length === 0) {
            /* TODO */
        } else {
            setSearchText(searchTextCurrent);
            setIsShowingResults(true);
        }
    };

    return (
        <div className="p-2">
            <Form onSubmit={(e) => handleSearch(e)}>
                <InputGroup>
                    <FormControl
                        ref={searchBox}
                        placeholder={`Search for ${type}`}
                    />
                    <Button type="submit">Search</Button>
                </InputGroup>
            </Form>
            {isShowingResults && (
                <SearchResults
                    type={type}
                    searchTerm={searchText}
                    setIsShowingResults={setIsShowingResults}
                />
            )}{" "}
            {/* pass the setter to allow this component to clear the results */}
        </div>
    );
}
