"use client"

import { Fragment } from "react"
import { Quotation } from "@/lib/types"
import { COMPANY_INFO, DEFAULT_CONTRACT_SETTINGS } from "@/lib/constants"
import { format } from "date-fns"
import { th } from "date-fns/locale"

interface QuotationDocumentProps {
    quotation: Quotation
}

export function QuotationDocument({ quotation }: QuotationDocumentProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-"
        try {
            return format(new Date(dateString), "d MMMM yyyy", { locale: th })
        } catch (e) {
            return "-"
        }
    }

    const items = quotation.items || []

    return (

        <div className="hidden print:block bg-white p-6 max-w-[210mm] mx-auto min-h-[297mm] text-black font-serif text-xs leading-normal">
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        margin: 0.5cm;
                    }
                }
            `}</style>
            {/* Header */}
            <div className="flex justify-between items-start mb-4 border-b pb-2">
                <div>
                    <h1 className="text-xl font-bold mb-1">ใบเสนอราคา (ประมาณการ)</h1>
                    <p className="text-gray-600 text-xs">{COMPANY_INFO.name}</p>
                    <p className="text-gray-600 text-xs">{COMPANY_INFO.address}</p>
                    <p className="text-gray-600 text-xs">โทร: {COMPANY_INFO.phone} อีเมล: {COMPANY_INFO.email}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">เลขที่ใบเสนอราคา:</span> {quotation.quotationNumber || quotation.id}</p>
                    <p><span className="font-bold">วันที่:</span> {formatDate(quotation.createdAt)}</p>
                </div>
            </div>

            {/* Customer & Project Info */}
            <div className="flex justify-between mb-4 gap-6">
                <div className="w-1/2">
                    <h3 className="font-bold border-b mb-1 pb-1">ข้อมูลลูกค้า</h3>
                    <p><span className="font-semibold">ชื่อลูกค้า:</span> {quotation.customerName}</p>
                </div>
                <div className="w-1/2">
                    <h3 className="font-bold border-b mb-1 pb-1">ข้อมูลโครงการ</h3>
                    <p><span className="font-semibold">แบบบ้าน:</span> {quotation.housePlanName}</p>
                    <p><span className="font-semibold">พื้นที่ใช้สอย:</span> {quotation.area} ตร.ม.</p>
                </div>
            </div>

            {/* Project Images (House & Floor Plans) */}
            <div className="mb-6">
                <div className="grid grid-cols-3 gap-2">
                    {/* House Image */}
                    {quotation.houseImage && (
                        <div className="border p-1 rounded bg-gray-50">
                            <div className="text-[9px] font-bold text-center mb-1 border-b">แบบบ้าน</div>
                            <div className="aspect-video relative overflow-hidden">
                                <img src={quotation.houseImage} alt="House Design" className="w-full h-full object-contain" />
                            </div>
                        </div>
                    )}

                    {/* Floor Plan Images */}
                    {quotation.floorPlanImages && quotation.floorPlanImages.map((img, idx) => (
                        <div key={idx} className="border p-1 rounded bg-gray-50">
                            <div className="text-[9px] font-bold text-center mb-1 border-b">แปลนชั้น {idx + 1}</div>
                            <div className="aspect-video relative overflow-hidden">
                                <img src={img} alt={`Floor Plan ${idx + 1}`} className="w-full h-full object-contain" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Items Table - Only show if not pending and has items */}
            {quotation.status !== "pending" && items.length > 0 ? (
                <>
                    <div className="mb-4">
                        <h3 className="font-bold mb-1 border-b pb-1">รายการประมาณการวัสดุและค่าใช้จ่าย (BOQ)</h3>
                        <table className="w-full border-collapse border border-gray-300 text-[10px]">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-1 text-center bg-gray-50 w-8">ลำดับ</th>
                                    <th className="border border-gray-300 p-1 text-left bg-gray-50">รายการ</th>
                                    <th className="border border-gray-300 p-1 text-right bg-gray-50 w-16">จำนวน</th>
                                    <th className="border border-gray-300 p-1 text-center bg-gray-50 w-12">หน่วย</th>
                                    <th className="border border-gray-300 p-1 text-right bg-gray-50 w-20">ราคาวัสดุ</th>
                                    <th className="border border-gray-300 p-1 text-right bg-gray-50 w-20">ค่าแรง</th>
                                    <th className="border border-gray-300 p-1 text-right bg-gray-50 w-24">รวมเป็นเงิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    "งานเตรียมการ/ฐานราก",
                                    "โครงสร้างหลัก",
                                    "โครงสร้างหลังคา",
                                    "งานสถาปัตย์/ตกแต่ง",
                                    "งานระบบ",
                                    "ประตู-หน้าต่าง",
                                    "งานภายนอก",
                                    "อื่นๆ"
                                ].map((cat) => {
                                    const categoryItems = items.filter(item => (cat === "อื่นๆ" && (!item.category || item.category === "อื่นๆ" || item.category === "อนื่นๆ")) || (item.category === cat))
                                    if (categoryItems.length === 0) return null

                                    return (
                                        <Fragment key={cat}>
                                            <tr key={`${cat}-header`} className="bg-gray-50 font-bold italic">
                                                <td colSpan={7} className="border border-gray-300 p-1 pl-4">{cat}</td>
                                            </tr>
                                            {categoryItems.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td className="border border-gray-300 p-1 text-center">{index + 1}</td>
                                                    <td className="border border-gray-300 p-1">{item.materialName || "-"}</td>
                                                    <td className="border border-gray-300 p-1 text-right">{Number(item.quantity || 0).toLocaleString()}</td>
                                                    <td className="border border-gray-300 p-1 text-center">{item.unit || "-"}</td>
                                                    <td className="border border-gray-300 p-1 text-right">{Number(item.materialPrice || 0).toLocaleString()}</td>
                                                    <td className="border border-gray-300 p-1 text-right">{Number(item.laborPrice || 0).toLocaleString()}</td>
                                                    <td className="border border-gray-300 p-1 text-right">{Number(item.totalPrice || 0).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end mb-4">
                        <div className="w-1/2 space-y-1">
                            <div className="flex justify-between">
                                <span>รวมค่าวัสดุ</span>
                                <span>{(quotation.totalMaterial || (Number(quotation.subtotal) - Number(quotation.laborCost)) || 0).toLocaleString()} บาท</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ค่าแรง</span>
                                <span>{(quotation.totalLabor || quotation.laborCost || 0).toLocaleString()} บาท</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ค่าดำเนินการ</span>
                                <span>{(quotation.operationCost || 0).toLocaleString()} บาท</span>
                            </div>

                            <div className="flex justify-between font-bold text-base border-t pt-1 mt-1">
                                <span>ยอดรวมทั้งสิ้น</span>
                                <span>{(quotation.grandTotal || 0).toLocaleString()} บาท</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="py-20 text-center border-2 border-dashed rounded mb-6">
                    <p className="text-lg font-bold text-gray-400">อยู่ระหว่างการจัดทำราคาและรายละเอียดวัสดุ</p>
                    <p className="text-gray-400">เอกสารนี้ยังไม่ใช่ใบเสนอราคาที่สมบูรณ์</p>
                </div>
            )}

            {/* Conditions */}
            {(quotation.notes || quotation.conditions) && (
                <div className="mb-4 border p-3 rounded bg-gray-50 text-xs">
                    <h3 className="font-bold mb-1">หมายเหตุและเงื่อนไข</h3>
                    {quotation.notes && (
                        <div className="mb-1">
                            <span className="font-semibold">หมายเหตุ: </span>
                            <span>{quotation.notes}</span>
                        </div>
                    )}
                    {quotation.conditions && (
                        <div>
                            <span className="font-semibold">เงื่อนไข: </span>
                            <span>{quotation.conditions}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Signatures */}
            <div className="flex justify-between mt-8 pt-4">
                <div className="text-center w-1/3">
                    <div className="border-b border-black mb-2 mx-auto w-3/4"></div>
                    <p>( {quotation.customerName || "........................................"})</p>
                    <p>ลูกค้า</p>
                    <p className="text-sm text-gray-500 mt-1">วันที่ ........................................</p>
                </div>
                <div className="text-center w-1/3">
                    <div className="border-b border-black mb-2 mx-auto w-3/4"></div>
                    <p>( {DEFAULT_CONTRACT_SETTINGS.contractor.name} )</p>
                    <p>ผู้รับเหมา</p>
                    <p className="text-sm text-gray-500 mt-1">วันที่ ........................................</p>
                </div>
            </div>
        </div>
    )
}
