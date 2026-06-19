"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { HOUSE_TYPES, HOUSE_STYLES } from "@/lib/house-plan-options"

interface HousePlanFiltersProps {
    currentType?: string
    currentStyle?: string
    availableTypes?: string[]
    availableStyles?: string[]
}

export function HousePlanFilters({
    currentType,
    currentStyle,
    availableTypes = ["all", ...HOUSE_TYPES],
    availableStyles = ["all", ...HOUSE_STYLES]
}: HousePlanFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleFilterChange = (key: "type" | "style", value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "all") {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`/house-plans?${params.toString()}`)
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
            <div className="w-full md:w-auto min-w-[300px]">
                <Select
                    value={currentType || "all"}
                    onValueChange={(val) => handleFilterChange("type", val)}
                >
                    <SelectTrigger className="w-full md:w-[300px] bg-white/5 backdrop-blur-md border-white/10 text-primary md:text-lg focus:ring-primary hover:bg-white/10 transition-all duration-300 h-20 rounded-none border-b-2 border-b-primary/40 px-8">
                        <SelectValue placeholder="ประเภทบ้านทั้งหมด" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1C1917]/95 border-white/10 text-white backdrop-blur-xl">
                        {availableTypes.map((type) => (
                            <SelectItem key={type} value={type} className="hover:bg-primary/20 focus:bg-primary/20 cursor-pointer py-4 text-lg">
                                {type === "all" ? "ประเภทบ้านทั้งหมด" : type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="hidden md:block h-12 w-px bg-white/10 self-end mb-1" />

            <div className="w-full md:w-auto min-w-[300px]">
                <Select
                    value={currentStyle || "all"}
                    onValueChange={(val) => handleFilterChange("style", val)}
                >
                    <SelectTrigger className="w-full md:w-[300px] bg-white/5 backdrop-blur-md border-white/10 text-primary md:text-lg focus:ring-primary hover:bg-white/10 transition-all duration-300 h-20 rounded-none border-b-2 border-b-primary/40 px-8">
                        <SelectValue placeholder="สไตล์บ้านทั้งหมด" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1C1917]/95 border-white/10 text-white backdrop-blur-xl">
                        {availableStyles.map((style) => (
                            <SelectItem key={style} value={style} className="hover:bg-primary/20 focus:bg-primary/20 cursor-pointer py-4 text-lg">
                                {style === "all" ? "สไตล์บ้านทั้งหมด" : style}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
