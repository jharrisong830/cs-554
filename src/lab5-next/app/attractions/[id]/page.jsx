import Attraction from "@/app/ui/Attraction";

export default async function Page({ params }) {
    const id = (await params).id;

    return <Attraction id={id} />;
}
