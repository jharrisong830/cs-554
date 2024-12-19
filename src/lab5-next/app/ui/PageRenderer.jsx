"use client";

import Link from "next/link";
import useAxios from "@/app/hooks/useAxios";
import NotFound from "@/app/ui/NotFound";
import DataCard from "@/app/ui/DataCard";
import SearchBar from "@/app/ui/SearchBar";
import { Button } from "react-bootstrap";

export default function PageRenderer({ type, page }) {
    // type in ["events", "attractions", "venues"]
    const API_KEY = "hvGmNotZE5aeMdxx3lO4KApTNzGah58a";
    const { data, loading, error } = useAxios(
        `https://app.ticketmaster.com/discovery/v2/${type}?apikey=${API_KEY}&countryCode=US&page=${parseInt(page) - 1}`
    );

    return (
        <main>
            <h1 className="p-2">{type}</h1>
            <SearchBar type={type} />
            {loading ? (
                <p className="p-2">Loading...</p>
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
                            <Button
                                as={Link}
                                href={`/${type}/page/${parseInt(page) - 1}`}
                                className="mx-2"
                            >
                                Back
                            </Button>
                        )}

                        <Button as={Link} href="/" className="mx-2">
                            Back to Home
                        </Button>

                        {parseInt(page) < data.page.totalPages && ( // render only if we are not at the past page
                            <Button
                                as={Link}
                                href={`/${type}/page/${parseInt(page) + 1}`}
                                className="mx-2"
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
