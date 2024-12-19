"use client";

import { Button } from "react-bootstrap";
import useAxios from "@/app/hooks/useAxios";

import NotFound from "@/app/ui/NotFound";

export default function Attraction({ id }) {
    const API_KEY = "hvGmNotZE5aeMdxx3lO4KApTNzGah58a";
    const { data, loading, error } = useAxios(
        `https://app.ticketmaster.com/discovery/v2/attractions/${id}?apikey=${API_KEY}&countryCode=US`
    );

    return (
        <main>
            {loading ? (
                <p className="p-2">Loading...</p>
            ) : error ? (
                <NotFound />
            ) : (
                <div>
                    <h1 className="p-2">{data.name}</h1>
                    <h3 className="p-2">{data.type}</h3>
                    <h3 className="p-2">
                        {data.upcomingEvents._total} upcoming event
                        {data.upcomingEvents._total === 1 ? "" : "s"}
                    </h3>

                    {data.images && data.images.length > 0 && (
                        <img
                            src={data.images[0].url}
                            alt={`${data.name} ${data.type} banner`}
                        />
                    )}

                    <p className="p-2">{data.description}</p>

                    <Button href={data.url} variant="primary">
                        View on Ticketmaster
                    </Button>
                </div>
            )}
        </main>
    );
}
