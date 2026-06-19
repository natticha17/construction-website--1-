import { notFound } from "next/navigation"
import { ShowcaseForm } from "@/components/admin/showcase-form"
import { AdminHeader } from "@/components/admin/admin-header"
import { store } from "@/lib/store"

export default async function EditShowcasePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const project = await store.getShowcaseProject(id)

    if (!project) {
        notFound()
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            <AdminHeader
                title="แก้ไขผลงาน"
                description={`แก้ไขข้อมูล: ${project.name}`}
                showBackButton
                backHref="/admin/showcase"
            />

            <div className="flex-1 p-8">
                <ShowcaseForm project={project} />
            </div>
        </div>
    )
}
