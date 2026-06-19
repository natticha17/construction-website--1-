"use client"

import React from 'react';
import { Contract } from '@/lib/types';
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { bahtText } from "@/lib/bahttext"

interface HandoverDocumentProps {
    contract: Contract;
}

export function HandoverDocument({ contract }: HandoverDocumentProps) {
    const today = new Date();
    const formatDateParts = (dateString?: Date | string) => {
        const date = dateString ? new Date(dateString) : new Date()
        return {
            day: date.getDate().toString(),
            month: format(date, "MMMM", { locale: th }),
            year: (date.getFullYear() + 543).toString()
        }
    }

    const dateParts = formatDateParts(today)

    const DottedData = ({ children, className = "", minWidth = "100px" }: { children: React.ReactNode, className?: string, minWidth?: string }) => (
        <span className={`inline-block border-b border-dotted border-black px-2 text-center text-blue-800 ${className}`} style={{ minWidth }}>
            {children || "................................................"}
        </span>
    )

    const emptyDot = "...................."

    // Address Helpers
    const initialAddress = { houseNo: "", village: "", road: "", subDistrict: "", district: "", province: "" }
    const custAddr = { ...initialAddress, ...(contract.customerAddressStructured || {}) }
    const contAddr = { ...initialAddress, ...(contract.contractorAddressStructured || {}) }
    const projAddr = { ...initialAddress, ...(contract.projectLocationStructured || {}) }

    return (
        <div className="bg-white p-8 md:p-12 shadow-lg max-w-[210mm] mx-auto min-h-[297mm] text-black font-serif text-[16px] leading-[1.8] tracking-wide relative print:shadow-none print:w-full print:max-w-none print:mx-0 print:p-[15mm]">
            <style jsx global>{`
                @page {
                    size: auto;
                    margin: 0mm;
                }
                @media print {
                    body {
                        background: white;
                    }
                }
            `}</style>

            {/* Page Reference */}
            <div className="absolute top-4 right-8 text-sm text-gray-400">
                อ้างอิงสัญญาเลขที่: {contract.contractNumber || contract.id}
            </div>

            {/* Header */}
            <div className="text-center mb-6 mt-4">
                <h1 className="text-2xl font-bold mb-1">ใบส่งมอบงานและรับมอบงาน</h1>
                <p className="text-lg">(Project Handover Certificate)</p>
            </div>

            <div className="text-right mb-6">
                <p>
                    ทำขึ้น ณ <DottedData minWidth="200px">{contAddr.province || "กรุงเทพมหานคร"}</DottedData>
                </p>
                <p>
                    วันที่ <DottedData minWidth="40px">{dateParts.day}</DottedData> เดือน <DottedData minWidth="100px">{dateParts.month}</DottedData> พ.ศ. <DottedData minWidth="60px">{dateParts.year}</DottedData>
                </p>
            </div>

            <div className="space-y-1 mb-6">
                <p className="indent-0">
                    ตามที่ <strong>{contract.contractorName || "นายอาคม เจริญผล"}</strong> (ต่อไปนี้เรียกว่า "ผู้รับจ้าง")
                </p>
                <p>
                    ได้ตกลงทำสัญญารับจ้างก่อสร้างกับ <strong>{contract.customerName}</strong> (ต่อไปนี้เรียกว่า "ผู้ว่าจ้าง")
                </p>
                <p>
                    ตามสัญญาเลขที่ <DottedData minWidth="150px">{contract.contractNumber}</DottedData> ลงวันที่ <DottedData minWidth="150px">{contract.contractSignedDate ? new Date(contract.contractSignedDate).toLocaleDateString("th-TH") : emptyDot}</DottedData>
                </p>
                <p>
                    เพื่อดำเนินการก่อสร้างโครงการ <DottedData minWidth="250px">{contract.projectName}</DottedData>
                </p>
                <p>
                    ณ สถานที่ก่อสร้างเลขที่ <DottedData minWidth="100px">{projAddr.houseNo || emptyDot}</DottedData> หมู่บ้าน <DottedData minWidth="120px">{projAddr.village || emptyDot}</DottedData> ถนน <DottedData minWidth="100px">{projAddr.road || emptyDot}</DottedData>
                </p>
                <p>
                    ตำบล/แขวง <DottedData minWidth="120px">{projAddr.subDistrict || emptyDot}</DottedData> อำเภอ/เขต <DottedData minWidth="120px">{projAddr.district || emptyDot}</DottedData> จังหวัด <DottedData minWidth="120px">{projAddr.province || emptyDot}</DottedData>
                </p>
            </div>

            <div className="space-y-3 text-justify leading-relaxed mb-8">
                <p className="indent-12">
                    บัดนี้ ผู้รับจ้างขอแจ้งให้ทราบว่า ได้ดำเนินการก่อสร้างตามสัญญาทั้งหมดเสร็จสมบูรณ์เรียบร้อยถูกต้องตามแบบรูปรายการและรายละเอียดในสัญญาทุกประการแล้ว รวมทั้งได้ดำเนินการเก็บและทำความสะอาดพื้นที่ก่อสร้างให้เรียบร้อยเพื่อเตรียมส่งมอบงานให้แก่ผู้ว่าจ้าง
                </p>
                <p className="indent-12">
                    โดยผู้ว่าจ้างได้ทำการตรวจรับมอบงานทั้งหมดแล้ว และมีความพึงพอใจว่างานก่อสร้างเป็นไปตามข้อตกลงและมาตรฐานที่กำหนดไว้ จึงถือว่าโครงการนี้ได้ดำเนินการเสร็จสิ้นสมบูรณ์ตามสัญญาจ่ายครบถ้วนทุกประการ
                </p>
                <p className="indent-12">
                    ในการนี้ ผู้รับจ้างได้ส่งมอบงาน และผู้ว่าจ้างได้รับมอบงานดังกล่าวไว้เป็นที่เรียบร้อยแล้ว โดยมีมูลค่าโครงการรวมทั้งสิ้น <DottedData minWidth="100px">{contract.contractValue.toLocaleString()}</DottedData> บาท (<DottedData minWidth="200px">{bahtText(contract.contractValue)}</DottedData>) และผู้รับจ้างได้รับชำระเงินค่าจ้างงวดสุดท้ายรวมถึงค่าจ้างทั้งหมดครบถ้วนแล้ว ณ วันที่ลงนามในเอกสารฉบับนี้
                </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-y-12 gap-x-12 mt-8">
                <div className="text-center space-y-2">
                    <p>ลงชื่อ ........................................................... ผู้ส่งมอบงาน</p>
                    <p>( {contract.contractorName || "นายอาคม เจริญผล"} )</p>
                    <p className="text-sm">ผู้รับจ้าง</p>
                </div>
                <div className="text-center space-y-2">
                    <p>ลงชื่อ ........................................................... ผู้รับมอบงาน</p>
                    <p>( {contract.customerName} )</p>
                    <p className="text-sm">ผู้ว่าจ้าง</p>
                </div>
            </div>
        </div>
    );
}
