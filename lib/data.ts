export interface HousePlan {
  id: string
  name: string
  image: string
  area: string
  bedrooms: number
  bathrooms: number
  price: string
  description: string
  features: string[]
}

export interface ContactInquiry {
  id: string
  name: string
  phone: string
  email: string
  message: string
  createdAt: string
}

export const housePlans: HousePlan[] = [
  {
    id: "1",
    name: "บ้านสไตล์โมเดิร์น A1",
    image: "/modern-thai-house-design-exterior-white.jpg",
    area: "150",
    bedrooms: 3,
    bathrooms: 2,
    price: "2,500,000",
    description: "บ้านชั้นเดียวสไตล์โมเดิร์น ดีไซน์เรียบหรู เน้นความโปร่งสบาย",
    features: ["ห้องนั่งเล่นกว้าง", "ครัวไทย", "ที่จอดรถ 2 คัน", "สวนหลังบ้าน"],
  },
  {
    id: "2",
    name: "บ้านสไตล์คอนเทมโพรารี่ B2",
    image: "/contemporary-thai-house-two-story.jpg",
    area: "200",
    bedrooms: 4,
    bathrooms: 3,
    price: "3,800,000",
    description: "บ้านสองชั้นสไตล์คอนเทมโพรารี่ พื้นที่ใช้สอยกว้างขวาง",
    features: ["ห้องนอนใหญ่พร้อมห้องแต่งตัว", "ห้องทำงาน", "ระเบียงชั้นบน", "ที่จอดรถ 2 คัน"],
  },
  {
    id: "3",
    name: "บ้านสไตล์มินิมอล C3",
    image: "/minimal-japanese-style-house.jpg",
    area: "120",
    bedrooms: 2,
    bathrooms: 2,
    price: "1,800,000",
    description: "บ้านชั้นเดียวสไตล์มินิมอล เรียบง่าย ลงตัว",
    features: ["ห้องนั่งเล่นเปิดโล่ง", "ครัวเปิด", "สวนหน้าบ้าน", "ที่จอดรถ 1 คัน"],
  },
  {
    id: "4",
    name: "บ้านสไตล์ทรอปิคอล D4",
    image: "/tropical-modern-house-with-pool.jpg",
    area: "280",
    bedrooms: 5,
    bathrooms: 4,
    price: "5,500,000",
    description: "บ้านสองชั้นสไตล์ทรอปิคอล พร้อมสระว่ายน้ำ",
    features: ["สระว่ายน้ำส่วนตัว", "ห้องนอนใหญ่ 5 ห้อง", "ห้องรับแขก", "ครัวไทยและครัวฝรั่ง"],
  },
  {
    id: "5",
    name: "บ้านสไตล์นอร์ดิก E5",
    image: "/scandinavian-nordic-style-house-wood.jpg",
    area: "180",
    bedrooms: 3,
    bathrooms: 3,
    price: "3,200,000",
    description: "บ้านสองชั้นสไตล์นอร์ดิก โทนสีอบอุ่น",
    features: ["เพดานสูง", "หน้าต่างกระจกใหญ่", "ระเบียงไม้", "พื้นที่สีเขียวรอบบ้าน"],
  },
  {
    id: "6",
    name: "บ้านสไตล์ลอฟท์ F6",
    image: "/industrial-loft-style-house-concrete.jpg",
    area: "160",
    bedrooms: 3,
    bathrooms: 2,
    price: "2,800,000",
    description: "บ้านสไตล์ลอฟท์อินดัสเทรียล ดิบเท่",
    features: ["ผนังปูนเปลือย", "โครงเหล็กโชว์", "พื้นที่เปิดโล่ง", "เพดานสูงโปร่ง"],
  },
]

export const services = [
  {
    id: 1,
    title: "ออกแบบบ้าน",
    description: "ออกแบบบ้านตามความต้องการ พร้อมแบบก่อสร้างครบชุด",
    icon: "PencilRuler",
  },
  {
    id: 2,
    title: "ก่อสร้างบ้าน",
    description: "รับสร้างบ้านครบวงจร ตั้งแต่วางฐานรากจนถึงส่งมอบบ้าน",
    icon: "Home",
  },
  {
    id: 3,
    title: "ต่อเติมบ้าน",
    description: "ต่อเติมพื้นที่ใช้สอย เพิ่มห้อง ขยายครัว ตามความต้องการ",
    icon: "PlusCircle",
  },
  {
    id: 4,
    title: "รีโนเวทบ้าน",
    description: "ปรับปรุงบ้านเก่าให้ใหม่ เปลี่ยนโฉมบ้านในฝัน",
    icon: "RefreshCw",
  },
]
