
import { QuotationItem } from "./types"

// --- Constants: Unit Prices (Approx) ---
// Note: These prices are estimates to calibrate towards ~12,000 THB/sqm total cost on average.
const PRICES = {
    // 1. Earthwork
    SOIL_EXCAVATION: 150, // per cu.m
    SOIL_FILLING: 350, // per cu.m

    // 2. Foundation
    CONCRETE_FOUNDATION: 2200, // per cu.m (ready-mix)
    STEEL_BAR: 35, // per kg

    // 3. Structure
    CONCRETE_STRUCTURE: 2200, // per cu.m
    STEEL_STRUCTURE: 35, // per kg (beams/columns)
    WOOD_FORM: 450, // per sq.m (formwork - omitted for simplicity or included below)

    // 4. Walls
    BRICK_LIGHTWEIGHT: 280, // per sq.m (material only)
    BRICK_CEMENT: 1500, // per cu.m (?) or let's say per unit
    PLASTER: 120, // per sq.m (material)

    // 5. Roof
    ROOF_STRUCTURE: 1200, // per sq.m (steel truss)
    ROOF_TILES: 350, // per sq.m (cpac)

    // 6. Ceiling
    CEILING_GYPSUM: 280, // per sq.m

    // 7. Floor
    FLOOR_TILES: 450, // per sq.m

    // 8. Doors/Windows
    DOOR_SET: 5000, // average per set
    WINDOW_SET: 4000, // average per set

    // 9. Electrical
    ELEC_POINT: 850, // per point (labor + material)

    // 10. Plumbing
    SANITARY_SET: 7500, // toilet + basin + accessories
    PIPE_METER: 250, // per meter

    // 11. Paint
    PAINT: 180, // per sq.m (2 coats)

    // Labor (as a percentage or separate items) -> User asked for labor in unit price or separate?
    // User formulas implied "Price = Vol * Price/Unit", usually material.
    // We will assume these are MATERIAL prices, and Labor is separate or included.
    // The system separates Labor Cost at the end. 
    // Let's use Material Only prices here ideally.
    // Adjusted slightly down for Material Only.
}

interface BOQParams {
    area: number // Total usable area (sq.m)
    storyType: "1" | "1.5" | "2"
    rooms?: {
        bedrooms: number
        bathrooms: number
        living: number
        kitchen: number
    }
}

export function generateBOQ(params: BOQParams): QuotationItem[] {
    const { area, storyType } = params
    const items: QuotationItem[] = []

    // --- Derived Dimensions ---
    // Approximate Ground Floor Area (Footprint)
    let footprint = area
    if (storyType === "2") footprint = area / 2
    else if (storyType === "1.5") footprint = area / 1.6 // rough estimate

    // Perimeter (assuming roughly square/rectangular)
    const width = Math.sqrt(footprint)
    const length = footprint / width
    const perimeter = (width + length) * 2

    // Height
    const floors = storyType === "1" ? 1 : 2 // 1.5 treated as 2 for height/structure mostly
    const floorHeight = 3.0 // meters
    const totalHeight = floors * floorHeight

    let idCounter = 1
    const addItem = (name: string, qty: number, unit: string, price: number, category: string = "") => {
        items.push({
            id: `boq-${idCounter++}`, // string id
            materialName: name,
            quantity: parseFloat(qty.toFixed(2)),
            unit,
            pricePerUnit: price,
            totalPrice: parseFloat((qty * price).toFixed(2)),
            category,
            laborPrice: 0 // Will apply global labor or per item if needed
        })
    }

    // category: string is missing in original QuotationItem interface? 
    // I will check types.ts. It has `category?: string`.

    // 1. งานเตรียมพื้นที่ / งานดิน (Site Prep)
    // 1.1 ดินฐานราก: Vol = WxLxD. Assume 10-15 foundations depending on area.
    const numFoundations = Math.ceil(footprint / 20) + 4
    const excavVol = numFoundations * 1.5 * 1.5 * 1.0 // 1.5x1.5x1m hole
    addItem("งานขุดดินฐานราก", excavVol, "ลบ.ม.", PRICES.SOIL_EXCAVATION, "1. งานเตรียมพื้นที่")

    // 1.2 ถมดิน: Vol = Area * Height (say 0.5m raise)
    const fillVol = footprint * 0.5
    addItem("งานถมดินปรับระดับ", fillVol, "ลบ.ม.", PRICES.SOIL_FILLING, "1. งานเตรียมพื้นที่")

    // 2. งานฐานราก (Foundation)
    // 2.1 คอนกรีต: num * 1x1x0.4 (footing size)
    const footingVol = numFoundations * 1.0 * 1.0 * 0.4
    addItem("คอนกรีตฐานราก 240 ksc", footingVol, "ลบ.ม.", PRICES.CONCRETE_FOUNDATION, "2. งานฐานราก")

    // 2.2 เหล็กเสริม: weight = length * kg/m. Assume 40kg per footing (rough estimate)
    const steelWeight = numFoundations * 45
    addItem("เหล็กเสริมคอนกรีตฐานราก", steelWeight, "กก.", PRICES.STEEL_BAR, "2. งานฐานราก")

    // 3. งานโครงสร้าง (Structure)
    // 3.1 เสา (Columns): Count * 0.2*0.2 * Height
    const numCols = numFoundations
    const colVol = numCols * 0.2 * 0.2 * totalHeight
    addItem("คอนกรีตเสา", colVol, "ลบ.ม.", PRICES.CONCRETE_STRUCTURE, "3. งานโครงสร้าง")
    addItem("เหล็กเสริมเสา", colVol * 180, "กก.", PRICES.STEEL_STRUCTURE, "3. งานโครงสร้าง") // 180kg steel per cu.m concrete approx

    // 3.2 คาน (Beams): Length approx (perimeter + inner grids).
    // Inner grid approx: sqrt(numCols) lines? ~ Total Length = 1.5 * (Area / Width)? 
    // Rule of thumb: Beam length ~ 3-4 times sqrt(Area) per floor.
    const beamLength = (Math.sqrt(footprint) * 4) * floors
    const beamVol = beamLength * 0.2 * 0.4 // 20x40cm beam
    addItem("คอนกรีตคาน", beamVol, "ลบ.ม.", PRICES.CONCRETE_STRUCTURE, "3. งานโครงสร้าง")
    addItem("เหล็กเสริมคาน", beamVol * 160, "กก.", PRICES.STEEL_STRUCTURE, "3. งานโครงสร้าง")

    // 3.3 พื้น (Floors)
    // Slab volume = Area * 0.1m
    const slabVol = area * 0.1
    addItem("คอนกรีตพื้น", slabVol, "ลบ.ม.", PRICES.CONCRETE_STRUCTURE, "3. งานโครงสร้าง")
    addItem("เหล็กเสริมพื้น (Wire Mesh)", area, "ตร.ม.", 60, "3. งานโครงสร้าง") // Special item

    // 4. งานผนัง (Walls)
    // Area = (Perimeter * Height) + (Inner partitions). Inner approx 1.5 * Perimeter?
    // Let's assume Wall Area = (Footprint Area * 1.5) to (Area * 1.0)?
    // Standard: Wall area ~ Area * 0.8 to 1.2 depending on layout. Let's use 1.0 for perimeter+partition
    // Using User formula: Length x Height. 
    const totalWallLength = perimeter * 1.5 * floors // Inner+Outer
    const wallGrossArea = totalWallLength * 3.0 // 3m height
    const wallNetArea = wallGrossArea * 0.85 // Deduct 15% for doors/windows openings

    // 4.1 ก่ออิฐ
    addItem("อิฐมวลเบา", wallNetArea, "ตร.ม.", PRICES.BRICK_LIGHTWEIGHT, "4. งานผนัง")
    // 4.2 ฉาบปูน (2 sides)
    addItem("ฉาบปูนเรียบ (ภายใน-ภายนอก)", wallNetArea * 2, "ตร.ม.", PRICES.PLASTER, "4. งานผนัง")

    // 5. งานหลังคา (Roof)
    // 5.1 Structure: Area * 1.3 (or 1.4 for steep)
    const roofFactor = storyType === "1.5" ? 1.4 : 1.3
    const roofArea = footprint * roofFactor

    addItem("โครงหลังคาเหล็กรูปพรรณ", roofArea, "ตร.ม.", PRICES.ROOF_STRUCTURE, "5. งานหลังคา")
    // 5.2 Tiles: Area / 10 tiles per sqm usually. But selling by sqm typically
    addItem("กระเบื้องหลังคา", roofArea, "ตร.ม.", PRICES.ROOF_TILES, "5. งานหลังคา")
    addItem("ฉนวนกันความร้อน", roofArea, "ตร.ม.", 150, "5. งานหลังคา")

    // 6. งานฝ้าเพดาน (Ceiling)
    // Area = Usable Area (approx)
    addItem("ฝ้าเพดานยิปซั่มฉบเรียบ", area, "ตร.ม.", PRICES.CEILING_GYPSUM, "6. งานฝ้าเพดาน")

    // 7. งานพื้น (Flooring)
    // Tiles: Area * 1.05 (waste)
    addItem("กระเบื้องปูพื้น", area * 1.05, "ตร.ม.", PRICES.FLOOR_TILES, "7. งานพื้น")
    addItem("กาวซีเมนต์/ยาแนว", area, "ตร.ม.", 80, "7. งานพื้น")

    // 8. ประตู-หน้าต่าง (Doors/Windows)
    // Count: approx 1 door per 15 sqm, 1.5 windows per 15 sqm?
    // Let's use rooms if available, else estimate.
    const estDoors = params.rooms ? (params.rooms.bedrooms + params.rooms.bathrooms + 2) : Math.ceil(area / 25) + 2
    const estWindows = params.rooms ? (params.rooms.bedrooms * 2 + params.rooms.living * 2) : Math.ceil(area / 15)

    addItem("ชุดประตู (รวมวงกบ)", estDoors, "ชุด", PRICES.DOOR_SET, "8. งานประตู-หน้าต่าง")
    addItem("ชุดหน้าต่าง (รวมวงกบ)", estWindows, "ชุด", PRICES.WINDOW_SET, "8. งานประตู-หน้าต่าง")

    // 9. งานไฟฟ้า (Electrical)
    // Points: approx 1 point per 4 sqm
    const elecPoints = Math.ceil(area / 4)
    addItem("จุดแสงสว่างและปลั๊กไฟ", elecPoints, "จุด", PRICES.ELEC_POINT, "9. งานไฟฟ้า")
    addItem("ตู้ควบคุมไฟฟ้า (Consumer Unit)", 1, "ชุด", 5000, "9. งานไฟฟ้า")

    // 10. งานประปา (Plumbing)
    // Toilets
    const bathrooms = params.rooms?.bathrooms || Math.ceil(storyType === "1" ? 1 : 2)
    addItem("สุขภัณฑ์และอุปกรณ์ห้องน้ำ", bathrooms, "ชุด", PRICES.SANITARY_SET, "10. งานประปา/สุขาภิบาล")
    addItem("ถังบำบัดน้ำเสีย", 1, "ถัง", 4500, "10. งานประปา/สุขาภิบาล")
    // Piping estimate
    addItem("เดินท่อน้ำดี/น้ำทิ้ง", bathrooms * 20 + 20, "เมตร", PRICES.PIPE_METER, "10. งานประปา/สุขาภิบาล")

    // 11. งานทาสี (Painting)
    // Wall Area (2 sides)
    addItem("ทาสีน้ำอะคริลิค (2 รอบ)", wallNetArea * 2, "ตร.ม.", PRICES.PAINT, "11. งานทาสี")

    return items
}
