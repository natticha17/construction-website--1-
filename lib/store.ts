// Unified in-memory store for both admin and customer data
import type {
  User,
  HousePlan,
  Quotation,
  Contract,
  ProjectProgress,
  FinancialRecord,
  ContactInquiry,
  ProgressMilestone, // Declare ProgressMilestone here
} from "./types"

// Initial house plans data
const initialHousePlans: HousePlan[] = [
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

// Demo admin user
const adminUser: User = {
  id: "admin-1",
  email: "admin@bansangfun.com",
  password: "admin123",
  name: "ผู้ดูแลระบบ",
  phone: "02-123-4567",
  address: "กรุงเทพมหานคร",
  customerType: "general",
  createdAt: new Date().toISOString(),
  role: "admin",
}

// Demo customer
const demoCustomer: User = {
  id: "customer-1",
  email: "customer@example.com",
  password: "customer123",
  name: "สมชาย ใจดี",
  phone: "081-234-5678",
  address: "123 ถนนสุขุมวิท กรุงเทพฯ 10110",
  customerType: "project_owner",
  createdAt: new Date().toISOString(),
  role: "customer",
}

// Demo quotation
const demoQuotation: Quotation = {
  id: "quot-1",
  customerId: "customer-1",
  customerName: "สมชาย ใจดี",
  housePlanId: "1",
  housePlanName: "บ้านสไตล์โมเดิร์น A1",
  area: 150,
  budget: "2,500,000",
  materialType: "มาตรฐาน",
  additionalRequirements: "ต้องการเพิ่มห้องเก็บของ",
  items: [
    { id: "1", materialName: "คอนกรีตผสมเสร็จ", quantity: 50, unit: "คิว", pricePerUnit: 2500, totalPrice: 125000 },
    { id: "2", materialName: "เหล็กเส้น DB16", quantity: 2000, unit: "กก.", pricePerUnit: 25, totalPrice: 50000 },
    { id: "3", materialName: "อิฐมวลเบา", quantity: 5000, unit: "ก้อน", pricePerUnit: 25, totalPrice: 125000 },
    { id: "4", materialName: "กระเบื้องหลังคา", quantity: 800, unit: "แผ่น", pricePerUnit: 150, totalPrice: 120000 },
    { id: "5", materialName: "ประตู-หน้าต่าง", quantity: 15, unit: "ชุด", pricePerUnit: 8000, totalPrice: 120000 },
  ],
  laborCost: 350000,
  operationCost: 100000,
  tax: 70000,
  subtotal: 540000,
  grandTotal: 1060000,
  notes: "ราคานี้ไม่รวมค่าตกแต่งภายในและเฟอร์นิเจอร์",
  conditions: "ใบเสนอราคานี้มีอายุ 30 วัน นับจากวันที่ออก",
  status: "approved",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Demo contract
const demoContract: Contract = {
  id: "contract-1",
  customerId: "customer-1",
  customerName: "สมชาย ใจดี",
  quotationId: "quot-1",
  projectName: "โครงการบ้านสมชาย",
  projectDetails: "สร้างบ้านสไตล์โมเดิร์น A1 พื้นที่ใช้สอย 150 ตร.ม. พร้อมห้องเก็บของเพิ่มเติม",
  contractValue: 2500000,
  constructionPeriod: "8 เดือน",
  startDate: "2025-02-01",
  endDate: "2025-09-30",
  status: "accepted",
  acceptedAt: "2025-01-15T10:00:00Z",
  createdAt: new Date().toISOString(),
}

// Demo project progress
const demoProgress: ProjectProgress = {
  id: "progress-1",
  contractId: "contract-1",
  customerId: "customer-1",
  projectName: "โครงการบ้านสมชาย",
  milestones: [
    {
      id: "m1",
      phase: 1,
      description: "งานฐานรากและโครงสร้าง",
      progressPercentage: 100,
      images: ["/construction-foundation-work.jpg"],
      updatedAt: "2025-02-15T10:00:00Z",
      paymentAmount: 500000,
      paymentStatus: "paid",
      paidAt: "2025-02-20T10:00:00Z",
    },
    {
      id: "m2",
      phase: 2,
      description: "งานก่ออิฐและฉาบปูน",
      progressPercentage: 75,
      images: ["/brick-wall-construction.png"],
      updatedAt: "2025-03-10T10:00:00Z",
      paymentAmount: 500000,
      paymentStatus: "pending",
    },
    {
      id: "m3",
      phase: 3,
      description: "งานหลังคาและฝ้าเพดาน",
      progressPercentage: 0,
      images: [],
      updatedAt: "",
      paymentAmount: 500000,
      paymentStatus: "pending",
    },
    {
      id: "m4",
      phase: 4,
      description: "งานระบบไฟฟ้าและประปา",
      progressPercentage: 0,
      images: [],
      updatedAt: "",
      paymentAmount: 500000,
      paymentStatus: "pending",
    },
    {
      id: "m5",
      phase: 5,
      description: "งานตกแต่งและส่งมอบ",
      progressPercentage: 0,
      images: [],
      updatedAt: "",
      paymentAmount: 500000,
      paymentStatus: "pending",
    },
  ],
  overallProgress: 35,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Demo financial records
const demoFinancialRecords: FinancialRecord[] = [
  {
    id: "fin-1",
    projectId: "progress-1",
    projectName: "โครงการบ้านสมชาย",
    type: "income",
    category: "เงินงวดที่ 1",
    description: "รับชำระเงินงวดที่ 1 - งานฐานราก",
    amount: 500000,
    date: "2025-02-20",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fin-2",
    projectId: "progress-1",
    projectName: "โครงการบ้านสมชาย",
    type: "expense",
    category: "ค่าวัสดุ",
    description: "คอนกรีตผสมเสร็จ 50 คิว",
    amount: 125000,
    date: "2025-02-10",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fin-3",
    projectId: "progress-1",
    projectName: "โครงการบ้านสมชาย",
    type: "expense",
    category: "ค่าแรง",
    description: "ค่าแรงงานเดือนกุมภาพันธ์",
    amount: 80000,
    date: "2025-02-28",
    createdAt: new Date().toISOString(),
  },
]

class Store {
  private users: User[] = [adminUser, demoCustomer]
  private housePlans: HousePlan[] = [...initialHousePlans]
  private quotations: Quotation[] = [demoQuotation]
  private contracts: Contract[] = [demoContract]
  private projectProgress: ProjectProgress[] = [demoProgress]
  private financialRecords: FinancialRecord[] = [...demoFinancialRecords]
  private inquiries: ContactInquiry[] = []

  // ============ Users ============
  getUsers(): User[] {
    return this.users.filter((u) => u.role === "customer")
  }

  getUser(id: string): User | undefined {
    return this.users.find((u) => u.id === id)
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email)
  }

  createUser(userData: Omit<User, "id" | "createdAt" | "role">): User {
    const newUser: User = {
      ...userData,
      id: `customer-${Date.now()}`,
      createdAt: new Date().toISOString(),
      role: "customer",
    }
    this.users.push(newUser)
    return newUser
  }

  validateUser(email: string, password: string): User | null {
    const user = this.users.find((u) => u.email === email && u.password === password)
    return user || null
  }

  updateUserType(userId: string, customerType: "general" | "project_owner"): User | null {
    const user = this.users.find((u) => u.id === userId)
    if (user) {
      user.customerType = customerType
      return user
    }
    return null
  }

  // ============ House Plans ============
  getHousePlans(): HousePlan[] {
    return this.housePlans
  }

  getHousePlan(id: string): HousePlan | undefined {
    return this.housePlans.find((p) => p.id === id)
  }

  addHousePlan(plan: Omit<HousePlan, "id">): HousePlan {
    const newPlan = { ...plan, id: Date.now().toString() }
    this.housePlans.push(newPlan)
    return newPlan
  }

  updateHousePlan(id: string, updates: Partial<HousePlan>): HousePlan | null {
    const index = this.housePlans.findIndex((p) => p.id === id)
    if (index === -1) return null
    this.housePlans[index] = { ...this.housePlans[index], ...updates }
    return this.housePlans[index]
  }

  deleteHousePlan(id: string): boolean {
    const index = this.housePlans.findIndex((p) => p.id === id)
    if (index === -1) return false
    this.housePlans.splice(index, 1)
    return true
  }

  // ============ Quotations ============
  getQuotations(): Quotation[] {
    return this.quotations
  }

  getQuotationsByCustomer(customerId: string): Quotation[] {
    return this.quotations.filter((q) => q.customerId === customerId)
  }

  getQuotation(id: string): Quotation | undefined {
    return this.quotations.find((q) => q.id === id)
  }

  createQuotation(data: Omit<Quotation, "id" | "createdAt" | "updatedAt">): Quotation {
    const quotation: Quotation = {
      ...data,
      id: `quot-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.quotations.push(quotation)
    return quotation
  }

  updateQuotation(id: string, updates: Partial<Quotation>): Quotation | null {
    const index = this.quotations.findIndex((q) => q.id === id)
    if (index === -1) return null
    this.quotations[index] = {
      ...this.quotations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.quotations[index]
  }

  deleteQuotation(id: string): boolean {
    const index = this.quotations.findIndex((q) => q.id === id)
    if (index === -1) return false
    this.quotations.splice(index, 1)
    return true
  }

  // ============ Contracts ============
  getContracts(): Contract[] {
    return this.contracts
  }

  getContractsByCustomer(customerId: string): Contract[] {
    return this.contracts.filter((c) => c.customerId === customerId)
  }

  getContract(id: string): Contract | undefined {
    return this.contracts.find((c) => c.id === id)
  }

  createContract(data: Omit<Contract, "id" | "createdAt">): Contract {
    const contract: Contract = {
      ...data,
      id: `contract-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.contracts.push(contract)
    return contract
  }

  acceptContract(id: string): Contract | null {
    const contract = this.contracts.find((c) => c.id === id)
    if (contract) {
      contract.status = "accepted"
      contract.acceptedAt = new Date().toISOString()
      return contract
    }
    return null
  }

  // ============ Project Progress ============
  getProjectProgressList(): ProjectProgress[] {
    return this.projectProgress
  }

  getProjectProgressByCustomer(customerId: string): ProjectProgress[] {
    return this.projectProgress.filter((p) => p.customerId === customerId)
  }

  getProjectProgress(id: string): ProjectProgress | undefined {
    return this.projectProgress.find((p) => p.id === id)
  }

  createProjectProgress(data: Omit<ProjectProgress, "id" | "createdAt" | "updatedAt">): ProjectProgress {
    const progress: ProjectProgress = {
      ...data,
      id: `progress-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.projectProgress.push(progress)
    return progress
  }

  updateMilestone(
    progressId: string,
    milestoneId: string,
    updates: Partial<ProgressMilestone>,
  ): ProjectProgress | null {
    const progress = this.projectProgress.find((p) => p.id === progressId)
    if (!progress) return null

    const milestoneIndex = progress.milestones.findIndex((m) => m.id === milestoneId)
    if (milestoneIndex === -1) return null

    progress.milestones[milestoneIndex] = {
      ...progress.milestones[milestoneIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    // Recalculate overall progress
    const completedMilestones = progress.milestones.filter((m) => m.progressPercentage === 100).length
    progress.overallProgress = Math.round((completedMilestones / progress.milestones.length) * 100)
    progress.updatedAt = new Date().toISOString()

    return progress
  }

  // ============ Financial Records ============
  getFinancialRecords(): FinancialRecord[] {
    return this.financialRecords
  }

  getFinancialRecordsByProject(projectId: string): FinancialRecord[] {
    return this.financialRecords.filter((f) => f.projectId === projectId)
  }

  createFinancialRecord(data: Omit<FinancialRecord, "id" | "createdAt">): FinancialRecord {
    const record: FinancialRecord = {
      ...data,
      id: `fin-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.financialRecords.push(record)
    return record
  }

  deleteFinancialRecord(id: string): boolean {
    const index = this.financialRecords.findIndex((f) => f.id === id)
    if (index === -1) return false
    this.financialRecords.splice(index, 1)
    return true
  }

  // ============ Inquiries ============
  getInquiries(): ContactInquiry[] {
    return this.inquiries
  }

  addInquiry(inquiry: Omit<ContactInquiry, "id" | "createdAt">): ContactInquiry {
    const newInquiry = {
      ...inquiry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.inquiries.push(newInquiry)
    return newInquiry
  }

  deleteInquiry(id: string): boolean {
    const index = this.inquiries.findIndex((i) => i.id === id)
    if (index === -1) return false
    this.inquiries.splice(index, 1)
    return true
  }
}

export const store = new Store()
