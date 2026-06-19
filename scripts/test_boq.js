
// Mock the calculator logic inline since we can't easily import TS in a JS script without setup
// This is to verify the LOGIC itself, which is what matters.
// I will copy the logic here to test it, confirming the FORMULAS work.

const PRICES = {
    SOIL_EXCAVATION: 150,
    SOIL_FILLING: 350,
    CONCRETE_FOUNDATION: 2200,
    STEEL_BAR: 35,
    CONCRETE_STRUCTURE: 2200,
    STEEL_STRUCTURE: 35,
    WOOD_FORM: 450,
    BRICK_LIGHTWEIGHT: 280,
    BRICK_CEMENT: 1500,
    PLASTER: 120,
    ROOF_STRUCTURE: 1200,
    ROOF_TILES: 350,
    CEILING_GYPSUM: 280,
    FLOOR_TILES: 450,
    DOOR_SET: 5000,
    WINDOW_SET: 4000,
    ELEC_POINT: 850,
    SANITARY_SET: 7500,
    PIPE_METER: 250,
    PAINT: 180,
}

function generateBOQ(params) {
    const { area, storyType } = params
    const items = []

    let footprint = area
    if (storyType === "2") footprint = area / 2
    else if (storyType === "1.5") footprint = area / 1.6

    const width = Math.sqrt(footprint)
    const length = footprint / width
    const perimeter = (width + length) * 2

    const floors = storyType === "1" ? 1 : 2
    const floorHeight = 3.0
    const totalHeight = floors * floorHeight

    let idCounter = 1
    const addItem = (name, qty, unit, price) => {
        items.push({
            materialName: name,
            quantity: parseFloat(qty.toFixed(2)),
            unit,
            pricePerUnit: price,
            totalPrice: parseFloat((qty * price).toFixed(2)),
        })
    }

    const numFoundations = Math.ceil(footprint / 20) + 4
    const excavVol = numFoundations * 1.5 * 1.5 * 1.0
    addItem("งานขุดดินฐานราก", excavVol, "ลบ.ม.", PRICES.SOIL_EXCAVATION)

    const fillVol = footprint * 0.5
    addItem("งานถมดินปรับระดับ", fillVol, "ลบ.ม.", PRICES.SOIL_FILLING)

    const footingVol = numFoundations * 1.0 * 1.0 * 0.4
    addItem("คอนกรีตฐานราก", footingVol, "ลบ.ม.", PRICES.CONCRETE_FOUNDATION)

    const steelWeight = numFoundations * 45
    addItem("เหล็กเสริมฐานราก", steelWeight, "กก.", PRICES.STEEL_BAR)

    const numCols = numFoundations
    const colVol = numCols * 0.2 * 0.2 * totalHeight
    addItem("คอนกรีตเสา", colVol, "ลบ.ม.", PRICES.CONCRETE_STRUCTURE)
    addItem("เหล็กเสริมเสา", colVol * 180, "กก.", PRICES.STEEL_STRUCTURE)

    const beamLength = (Math.sqrt(footprint) * 4) * floors
    const beamVol = beamLength * 0.2 * 0.4
    addItem("คอนกรีตคาน", beamVol, "ลบ.ม.", PRICES.CONCRETE_STRUCTURE)
    addItem("เหล็กเสริมคาน", beamVol * 160, "กก.", PRICES.STEEL_STRUCTURE)

    const slabVol = area * 0.1
    addItem("คอนกรีตพื้น", slabVol, "ลบ.ม.", PRICES.CONCRETE_STRUCTURE)
    addItem("เหล็กเสริมพื้น", area, "ตร.ม.", 60)

    const totalWallLength = perimeter * 1.5 * floors
    const wallGrossArea = totalWallLength * 3.0
    const wallNetArea = wallGrossArea * 0.85

    addItem("อิฐมวลเบา", wallNetArea, "ตร.ม.", PRICES.BRICK_LIGHTWEIGHT)
    addItem("ฉาบปูน", wallNetArea * 2, "ตร.ม.", PRICES.PLASTER)

    const roofFactor = storyType === "1.5" ? 1.4 : 1.3
    const roofArea = footprint * roofFactor

    addItem("โครงหลังคา", roofArea, "ตร.ม.", PRICES.ROOF_STRUCTURE)
    addItem("กระเบื้องหลังคา", roofArea, "ตร.ม.", PRICES.ROOF_TILES)
    addItem("ฉนวน", roofArea, "ตร.ม.", 150)

    addItem("ฝ้าเพดาน", area, "ตร.ม.", PRICES.CEILING_GYPSUM)

    addItem("กระเบื้องปูพื้น", area * 1.05, "ตร.ม.", PRICES.FLOOR_TILES)
    addItem("กาวซีเมนต์", area, "ตร.ม.", 80)

    const estDoors = Math.ceil(area / 25) + 2
    const estWindows = Math.ceil(area / 15)

    addItem("ชุดประตู", estDoors, "ชุด", PRICES.DOOR_SET)
    addItem("ชุดหน้าต่าง", estWindows, "ชุด", PRICES.WINDOW_SET)

    const elecPoints = Math.ceil(area / 4)
    addItem("จุดไฟ", elecPoints, "จุด", PRICES.ELEC_POINT)
    addItem("ตู้ไฟ", 1, "ชุด", 5000)

    const bathrooms = Math.ceil(storyType === "1" ? 1 : 2)
    addItem("สุขภัณฑ์", bathrooms, "ชุด", PRICES.SANITARY_SET)
    addItem("ถังบำบัด", 1, "ถัง", 4500)
    addItem("เดินท่อ", bathrooms * 20 + 20, "เมตร", PRICES.PIPE_METER)

    addItem("ทาสี", wallNetArea * 2, "ตร.ม.", PRICES.PAINT)

    return items
}

// Test Case 1: 100 sq.m, 1 Story
console.log("--- Test Case 1: 100 sq.m, 1 Story ---");
const items1 = generateBOQ({ area: 100, storyType: "1" });
const total1 = items1.reduce((sum, item) => sum + item.totalPrice, 0);
const tax1 = total1 * 0.07;
// Add approx labor+growth margin of 35%?
// Prices in our table are "Material Only" mostly for some items, but "Set" for others.
// The user asked for "12000 per sqm".
// Let's see what the RAW material cost comes out to.
console.log("Material Cost:", total1.toLocaleString());
console.log("Material/sqm:", (total1 / 100).toLocaleString());

// Test Case 2: 200 sq.m, 2 Stories
console.log("\n--- Test Case 2: 200 sq.m, 2 Stories ---");
const items2 = generateBOQ({ area: 200, storyType: "2" });
const total2 = items2.reduce((sum, item) => sum + item.totalPrice, 0);
console.log("Material Cost:", total2.toLocaleString());
console.log("Material/sqm:", (total2 / 200).toLocaleString());
