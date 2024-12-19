import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";


export default function SearchResults({ searchType, query, queryParams, setIsShowingResults }) {
    const { loading, error, data } = useQuery(query, {
        variables: queryParams,
        fetchPolicy: "cache-and-network"
    });
    
    const handleClearResults = (e) => {
        e.preventDefault();
        setIsShowingResults(false); // stop showing this component
    };

    const getRoutePrefix = () => {
        switch (searchType) {
            case "booksByGenre":
            case "searchBookByTitle":
                return "/books";
            case "publishersByEstablishedYear":
                return "/publishers";
            case "searchAuthorByName":
                return "/authors";
        }
    };

    return (
        <div className="alert alert-primary">
            <Button onClick={(e) => handleClearResults(e)} variant="danger">Clear Search Results</Button>
            {loading ? <p>Loading...</p> : (
                error ? <p>Oops! There was an error loading the data. {JSON.stringify(error)}</p> : (
                    <div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>item</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data[searchType].map((elem) => 
                                    <tr key={elem._id}>
                                        <td><Link to={`${getRoutePrefix()}/${elem._id}`}>{getRoutePrefix() === "/books" ? elem.title : elem.name}</Link></td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )
            )}
        </div>
    );
}