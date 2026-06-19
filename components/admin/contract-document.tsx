import { Contract } from "@/lib/types"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { bahtText } from "@/lib/bahttext"
import { DEFAULT_CONTRACT_SETTINGS } from "@/lib/constants"

interface ContractDocumentProps {
    contract: Contract
}

export function ContractDocument({ contract }: ContractDocumentProps) {
    const formatDateParts = (dateString?: string) => {
        if (!dateString) return { day: "......", month: "..................", year: "........." }
        const date = new Date(dateString)
        return {
            day: date.getDate().toString(),
            month: format(date, "MMMM", { locale: th }),
            year: (date.getFullYear() + 543).toString()
        }
    }

    const formatMoney = (amount: number) => {
        return amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const DottedData = ({ children, className = "", minWidth = "100px" }: { children: React.ReactNode, className?: string, minWidth?: string }) => (
        <span className={`inline-block border-b border-dotted border-black px-2 text-center text-blue-800 ${className}`} style={{ minWidth }}>
            {children || "................................................"}
        </span>
    )

    const dateParts = formatDateParts(contract.contractSignedDate || contract.startDate)
    const installments = contract.installments || []

    // Address Helpers - Robust merging and fallbacks
    const initialAddress = { houseNo: "", village: "", road: "", subDistrict: "", district: "", province: "" }

    // Merge existing data with initial address to ensure no individual fields are undefined
    const custAddr = { ...initialAddress, ...(contract.customerAddressStructured || {}) }
    const projAddr = { ...initialAddress, ...(contract.projectLocationStructured || {}) }
    const contAddr = { ...DEFAULT_CONTRACT_SETTINGS.contractor.addressStructured, ...(contract.contractorAddressStructured || {}) }

    // Logic to decide whether to show structured field or fallback to legacy summary string in the first field
    const showCustHouseNo = custAddr.houseNo || contract.customerAddress || ".................."
    const showProjHouseNo = projAddr.houseNo || contract.projectLocation || ".................."
    const showContHouseNo = contAddr.houseNo || contract.contractorAddress || ".................."

    const emptyDot = "...................."

    const formatInstallmentDate = (dateString?: string) => {
        if (!dateString) return emptyDot

        // Check if it's a valid date string (YYYY-MM-DD)
        const date = new Date(dateString)
        if (isNaN(date.getTime()) || !dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString // Return as-is if it's text
        }

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = (date.getFullYear() + 543).toString()

        return `${day}/${month}/${year}`
    }

    return (
        <div className="bg-white p-8 md:p-12 shadow-lg max-w-[210mm] mx-auto min-h-[297mm] text-black font-serif text-[16px] leading-[2.2] tracking-wide relative print:shadow-none print:w-full print:max-w-none print:mx-0 print:p-[20mm]">

            {/* Page Number approx */}
            <div className="absolute top-4 right-8 text-sm text-gray-400">
                เลขที่สัญญา: {contract.contractNumber || contract.id}
            </div>

            <h1 className="text-2xl font-bold text-center mb-6 mt-4">แบบสัญญาจ้าง</h1>

            <div className="text-right">
                <p>
                    สัญญาฉบับนี้ทำขึ้น ณ บ้านเลขที่ <DottedData minWidth="100px">{contract.customerAddressStructured?.houseNo || emptyDot}</DottedData>
                </p>
            </div>

            <div className="space-y-0">
                <p>
                    เมื่อวันที่ <DottedData minWidth="50px">{dateParts.day}</DottedData> เดือน <DottedData minWidth="120px">{dateParts.month}</DottedData> พ.ศ. <DottedData minWidth="80px">{dateParts.year}</DottedData>
                </p>
                <p>
                    ระหว่าง <DottedData minWidth="200px">{contract.contractorName}</DottedData>  กับ <DottedData minWidth="200px">{contract.customerName}</DottedData>
                </p>
                <p className="indent-0">
                    อยู่บ้านเลขที่ <DottedData minWidth="100px">{showContHouseNo}</DottedData> หมู่บ้าน <DottedData minWidth="100px">{contAddr.village || emptyDot}</DottedData> ถนน <DottedData minWidth="100px">{contAddr.road || emptyDot}</DottedData> ตำบล/แขวง <DottedData minWidth="100px">{contAddr.subDistrict || emptyDot}</DottedData>
                </p>
                <p>
                    อำเภอ/เขต <DottedData minWidth="100px">{contAddr.district || emptyDot}</DottedData> จังหวัด <DottedData minWidth="100px">{contAddr.province || emptyDot}</DottedData> ซึ่งต่อไปในสัญญานี้
                </p>
                <p>
                    เรียกว่า <strong>"ผู้รับจ้าง"</strong> ฝ่ายหนึ่ง กับ <DottedData minWidth="250px">{contract.customerName}</DottedData>
                </p>
                <p>
                    อยู่บ้านเลขที่ <DottedData minWidth="100px">{showCustHouseNo}</DottedData> หมู่บ้าน <DottedData minWidth="100px">{custAddr.village || emptyDot}</DottedData> ถนน <DottedData minWidth="100px">{custAddr.road || emptyDot}</DottedData> ตำบล/แขวง <DottedData minWidth="100px">{custAddr.subDistrict || emptyDot}</DottedData>
                </p>
                <p>
                    อำเภอ/เขต <DottedData minWidth="100px">{custAddr.district || emptyDot}</DottedData> จังหวัด <DottedData minWidth="100px">{custAddr.province || emptyDot}</DottedData> ซึ่งต่อไปในสัญญานี้
                </p>
                <p>
                    เรียกว่า <strong>"ผู้ว่าจ้าง"</strong> อีกฝ่ายหนึ่ง คู่สัญญาได้ตกลงกันดังต่อไปนี้
                </p>
            </div>

            <div className="mt-4">
                <h2 className="font-bold">ข้อ ๑. ข้อตกลงว่าจ้าง</h2>
                <p className="indent-10 text-justify">
                    ผู้ว่าจ้างตกลงจ้างและผู้รับจ้างตกลงรับจ้างทำงานก่อสร้างบ้านพักที่อยู่อาศัย ณ
                </p>
                <p className="indent-0 text-justify">
                    บ้านเลขที่ <DottedData minWidth="100px">{showProjHouseNo}</DottedData> หมู่บ้าน <DottedData minWidth="100px">{projAddr.village || emptyDot}</DottedData> ถนน <DottedData minWidth="100px">{projAddr.road || emptyDot}</DottedData> ตำบล/แขวง <DottedData minWidth="100px">{projAddr.subDistrict || emptyDot}</DottedData> อำเภอ/เขต <DottedData minWidth="100px">{projAddr.district || emptyDot}</DottedData> จังหวัด <DottedData minWidth="100px">{projAddr.province || emptyDot}</DottedData>
                </p>
                <p className="indent-0 text-justify">
                    ตามข้อกำหนดและเงื่อนไขแห่งสัญญานี้รวมทั้งเอกสารแนบท้ายสัญญาผู้รับจ้างตกลงที่จะจัดหาแรงและวัสดุ เครื่องมือเครื่องใช้ ตลอดจนอุปกรณ์ต่างๆชนิดดีเพื่อใช้ในงานจ้างตามสัญญานี้
                </p>
            </div>

            <div className="mt-4">
                <h2 className="font-bold">ข้อ ๒. ค่าจ้างและการจ่ายเงิน</h2>
                <p className="indent-12 text-justify">
                    ผู้ว่าจ้างตกลงและผู้รับจ้างตกลงรับเงินค่าจ้างจำนวนเงิน <DottedData minWidth="50px" className="font-bold">{formatMoney(contract.contractValue)}</DottedData> บาท
                </p>
                <p className="indent-0 text-justify">
                    <DottedData minWidth="70px" className="font-bold">({bahtText(contract.contractValue)})</DottedData>
                    และค่าใช้จ่ายทั้งปวงด้วยแล้ว โดยถือราคาเหมารวมเป็นเกณฑ์และกำหนด การจ่ายเงินเป็นงวด ๆ ดังนี้
                </p>

                <div className="pl-0 mt-2 mb-6 space-y-4">
                    {installments.map((installment, index) => {
                        const isLast = index === installments.length - 1;
                        const percentage = (installment.amount / contract.contractValue) * 100;

                        return (
                            <div key={index} className="mb-4">
                                <p className="indent-4 text-justify leading-relaxed">
                                    <strong>งวดที่ {installment.installmentNumber}</strong> เป็นเงินจำนวนร้อยละ <DottedData minWidth="40px">{percentage.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</DottedData> ของค่าจ้างทั้งหมด เป็นเงินจำนวน <DottedData minWidth="100px">{formatMoney(installment.amount)}</DottedData> บาท
                                    ( <DottedData minWidth="150px">{bahtText(installment.amount)}</DottedData> )
                                </p>
                                <p className="indent-4 text-justify leading-relaxed">
                                    เมื่อผู้รับจ้างได้ดำเนินงาน: {installment.description} แล้วเสร็จเรียบร้อยถูกต้องตามแบบรูปรายการทุกประการ
                                </p>
                                <p className="indent-4 text-justify leading-relaxed">
                                    กำหนดชำระเงินวันที่: <DottedData minWidth="100px">{formatInstallmentDate(installment.dueDate)}</DottedData>
                                </p>
                                {isLast && (
                                    <p className="indent-4 text-justify leading-relaxed mt-2">
                                        (ในกรณีงวดสุดท้าย ผู้รับจ้างต้องดำเนินการเก็บงานรายละเอียดตกค้าง และรายการอื่น ๆ ให้แล้วเสร็จสมบูรณ์
                                        รวมทั้งจัดการสถานที่ก่อสร้างให้สะอาดเรียบร้อย ตามแบบรูปรายการมาตรฐานประกอบแบบก่อสร้างทั้งหมด
                                        จึงจะถือว่าเป็นการปฏิบัติงานครบถ้วนตามสัญญา)
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>

                <p className="mt-8 indent-12 text-justify leading-relaxed">
                    สัญญานี้ทำขึ้นเป็นสองฉบับ มีข้อตกลงถูกต้องตรงกัน คู่สัญญาได้อ่านและเข้าใจความโดยละเอียดตลอด
                    แล้ว จึงได้ลงลายมือชื่อไว้เป็นสำคัญต่อหน้าพยาน และคู่สัญญาต่างยึดถือไว้ฝ่ายละหนึ่งฉบับ
                </p>
            </div>

            {/* Signatures */}
            <div className="mt-12 grid grid-cols-2 gap-y-8 gap-x-4">
                <div className="text-center">
                    <p className="mb-6">ลงชื่อ <DottedData minWidth="100px">{contract.customerName}</DottedData> ผู้ว่าจ้าง</p>
                    <p>( {contract.customerName} )</p>
                </div>
                <div className="text-center">
                    <p className="mb-6">ลงชื่อ <DottedData minWidth="100px">{contract.contractorName}</DottedData> ผู้รับจ้าง</p>
                    <p>( {contract.contractorName || "นายอาคม เจริญผล"} )</p>
                </div>
            </div>

            {/* Added: Material List Section (New Page) */}
            {contract.items && contract.items.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 break-before-page">
                    <h2 className="font-bold mb-4">เอกสารแนบ: รายการวัสดุอุปกรณ์</h2>
                    <table className="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">รายการ</th>
                                <th className="border border-gray-300 p-2 text-right w-[100px]">จำนวน</th>
                                <th className="border border-gray-300 p-2 text-right w-[100px]">หน่วย</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contract.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="border border-gray-300 p-2">{item.materialName}</td>
                                    <td className="border border-gray-300 p-2 text-right">{item.quantity}</td>
                                    <td className="border border-gray-300 p-2 text-right">{item.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Added: House Design and Floor Plans Section */}
            {(contract.houseImage || (contract.floorPlanImages && contract.floorPlanImages.length > 0)) && (
                <div className="mt-8 pt-6 border-t border-gray-100 break-before-page">
                    <h2 className="font-bold mb-4 text-center">เอกสารแนบ: แบบบ้านและผังพื้น</h2>
                    <div className="space-y-6">
                        {contract.houseImage && (
                            <div className="text-center">
                                <p className="text-sm font-semibold mb-2 text-gray-600 font-sans">ทัศนียภาพจำลอง (House Design)</p>
                                <img src={contract.houseImage} alt="House Design" className="max-w-full h-auto max-h-[350px] mx-auto rounded-lg shadow-sm border p-1 bg-white" />
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-6">
                            {contract.floorPlanImages?.map((img, idx) => (
                                <div key={idx} className="text-center">
                                    <p className="text-sm font-semibold mb-2 text-gray-600 font-sans">ผังพื้น (Floor Plan {idx + 1})</p>
                                    <img src={img} alt={`Floor Plan ${idx + 1}`} className="max-w-full h-auto max-h-[350px] mx-auto border p-1 bg-white" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
