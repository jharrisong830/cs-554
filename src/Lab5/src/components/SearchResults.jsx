import { Button } from "react-bootstrap";
import DataCard from "../components/DataCard";
import NotFound from "../NotFound";
import useAxios from "../hooks/useAxios";

export default function SearchResults({ type, searchTerm, setIsShowingResults }) {
    const API_KEY = "hvGmNotZE5aeMdxx3lO4KApTNzGah58a";
    const { data, loading, error } = useAxios(`https://app.ticketmaster.com/discovery/v2/${type}?apikey=${API_KEY}&countryCode=US&keyword=${searchTerm}`);

    const handleClearResults = (e) => {
        e.preventDefault();
        setIsShowingResults(false); // stop showing this component
    };

    return (
        <div className="alert alert-primary">
            <Button onClick={(e) => handleClearResults(e)} variant="danger">Clear Search Results</Button>
        {loading ? (<p>Loading...</p>) : (
            error || !data._embedded ? (<NotFound />) : (
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        {data._embedded[type].map((elem) => 
                            <DataCard 
                                key={elem.id} 
                                name={elem.name} 
                                type={type} 
                                detailsURL={`/${type}/${elem.id}`} 
                                imgSrc={elem.images && elem.images.length > 0 ? elem.images[0].url : ""} 
                                startDate={type === "events" ? elem.dates.start.localDate : ""}
                                description={type === "attractions" ? elem.description : ""}
                            />
                        )}
                    </div>
                </div>
            )
        )}
        </div>
    );
}