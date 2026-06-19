"use client"

import { Contract } from "@/lib/types"
import { ContractDocument } from "@/components/admin/contract-document"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

interface CustomerContractWrapperProps {
    contract: Contract
}

export function CustomerContractWrapper({ contract }: CustomerContractWrapperProps) {
    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center print:hidden">
                <div className="text-sm text-muted-foreground italic">
                    * ท่านสามารถดูตัวอย่างสัญญาฉบับเต็มและสั่งพิมพ์ได้จากหน้านี้
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        พิมพ์สัญญา / บันทึกเป็น PDF
                    </Button>
                </div>
            </div>

            <div className="bg-slate-100 p-2 md:p-8 rounded-xl shadow-inner border border-slate-200 overflow-auto">
                <div className="min-w-[800px] flex justify-center">
                    <ContractDocument contract={contract} />
                </div>
            </div>
        </div>
    )
}
