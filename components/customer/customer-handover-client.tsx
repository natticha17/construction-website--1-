
"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { HandoverDocument } from "../admin/handover-document"
import type { Contract } from "@/lib/types"

export function CustomerHandoverClient({ contract }: { contract: Contract }) {
    const contentRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `ใบส่งมอบงาน_${contract.projectName}`,
    })

    return (
        <>
            <Button size="lg" className="shadow-lg rounded-full px-6" onClick={() => handlePrint()}>
                <Printer className="h-5 w-5 mr-2" />
                พิมพ์เอกสาร
            </Button>

            {/* Hidden Printable Component */}
            <div className="hidden">
                <div ref={contentRef}>
                    <HandoverDocument contract={contract} />
                </div>
            </div>
        </>
    )
}
