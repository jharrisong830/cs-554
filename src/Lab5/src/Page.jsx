import { Link, useParams } from "react-router-dom";
import useAxios from "./hooks/useAxios";
import NotFound from "./NotFound";
import DataCard from "./components/DataCard";
import SearchBar from "./components/SearchBar";

export default function Page({ type }) {
    // type in ["events", "attractions", "venues"]
    const API_KEY = "hvGmNotZE5aeMdxx3lO4KApTNzGah58a";
    const { page } = useParams();
    const { data, loading, error } = useAxios(
        `https://app.ticketmaster.com/discovery/v2/${type}?apikey=${API_KEY}&countryCode=US&page=${parseInt(page) - 1}`
    );

    return (
        <main>
            <h1>{type}</h1>
            <SearchBar type={type} />
            {loading ? (
                <p>Loading...</p>
            ) : error || !data._embedded ? (
                <NotFound />
            ) : (
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        {data._embedded[type].map((elem) => (
                            <DataCard
                                key={elem.id}
                                name={elem.name}
                                type={type}
                                detailsURL={`/${type}/${elem.id}`}
                                imgSrc={
                                    elem.images && elem.images.length > 0
                                        ? elem.images[0].url
                                        : ""
                                }
                                startDate={
                                    type === "events"
                                        ? elem.dates.start.localDate
                                        : ""
                                }
                                description={
                                    type === "attractions"
                                        ? elem.description
                                        : ""
                                }
                            />
                        ))}
                    </div>

                    <div>
                        {parseInt(page) > 1 && ( // render the below element only if LHS is true, if we are beyond the first page
                            <Link
                                to={`/${type}/page/${parseInt(page) - 1}`}
                                className="button-wrapper"
                            >
                                Back
                            </Link>
                        )}

                        <Link to="/" className="button-wrapper">
                            Back to Home
                        </Link>

                        {parseInt(page) < data.page.totalPages && ( // render only if we are not at the past page
                            <Link
                                to={`/${type}/page/${parseInt(page) + 1}`}
                                className="button-wrapper"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
