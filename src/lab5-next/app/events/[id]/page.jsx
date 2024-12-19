import Event from "@/app/ui/Event";

export default async function Page({ params }) {
    const id = (await params).id;

    return <Event id={id} />;
}
