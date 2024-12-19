import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import useAxios from "./hooks/useAxios";

import NotFound from "./NotFound";

export default function Event() {
    const API_KEY = "hvGmNotZE5aeMdxx3lO4KApTNzGah58a";
    const { id } = useParams();
    const { data, loading, error } = useAxios(
        `https://app.ticketmaster.com/discovery/v2/events/${id}?apikey=${API_KEY}&countryCode=US`
    );

    return (
        <main>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <NotFound />
            ) : (
                <div>
                    <h1>{data.name}</h1>
                    <h3>{data.type}</h3>
                    <h3>{data.dates.start.localDate}</h3>
                    {data.priceRanges &&
                        data.priceRanges.find(
                            (elem) => elem.currency === "USD"
                        ) && ( // make sure price ranges exists and that it contains an element in USD
                            <h3>
                                $
                                {
                                    data.priceRanges.find(
                                        (elem) => elem.currency === "USD"
                                    ).min
                                }{" "}
                                - $
                                {
                                    data.priceRanges.find(
                                        (elem) => elem.currency === "USD"
                                    ).max
                                }
                            </h3>
                        )}

                    {data.images && data.images.length > 0 && (
                        <img
                            src={data.images[0].url}
                            alt={`${data.name} ${data.type} banner`}
                        />
                    )}

                    <p>{data.info}</p>

                    <Button href={data.url} variant="primary">
                        View on Ticketmaster
                    </Button>
                </div>
            )}
        </main>
    );
}