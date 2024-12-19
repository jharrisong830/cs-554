import PageRenderer from "@/app/ui/PageRenderer";

export default async function Page({ params }) {
    const pageNum = (await params).pageNum;

    return <PageRenderer type="attractions" page={pageNum} />;
}
