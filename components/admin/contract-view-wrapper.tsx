"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditContractForm } from "./edit-contract-form"
import { ContractDocument } from "./contract-document"
import { Contract } from "@/lib/types"

interface ContractViewWrapperProps {
    contract: Contract
    users: any[] // Using any for simplicity as User type is defined in EditContractForm or Types
}

export function ContractViewWrapper({ contract, users }: ContractViewWrapperProps) {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="document" className="w-full">
                <div className="flex justify-center mb-6 print:hidden">
                    <TabsList className="grid w-[400px] grid-cols-2">
                        <TabsTrigger value="document">ใบสัญญา (Preview)</TabsTrigger>
                        <TabsTrigger value="edit">แก้ไขข้อมูล (Edit)</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="edit">
                    <EditContractForm contract={contract} users={users} />
                </TabsContent>

                <TabsContent value="document" className="bg-gray-100 p-4 md:p-8 rounded-lg overflow-auto print:bg-white print:p-0 print:overflow-visible">
                    <div className="flex justify-end mb-4 print:hidden">
                        {/* Print button could go here */}
                        <button
                            onClick={() => window.print()}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                        >
                            พิมพ์สัญญา
                        </button>
                    </div>
                    <ContractDocument contract={contract} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
