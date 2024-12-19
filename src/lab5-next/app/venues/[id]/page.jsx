import Venue from "@/app/ui/Venue";

export default async function Page({ params }) {
    const id = (await params).id;

    return <Venue id={id} />;
}
