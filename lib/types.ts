// Types for the construction management system

export interface User {
  id: string
  email: string
  password: string // In production, this should be hashed
  name: string
  phone: string
  address: string
  houseNo?: string
  village?: string
  road?: string
  subDistrict?: string
  district?: string
  province?: string
  customerType: "general" | "project_owner" // ลูกค้าทั่วไป / เจ้าของโครงการ
  createdAt: string
  role: "customer" | "admin"
}

export interface HousePlan {
  id: string
  name: string
  image: string
  area: string
  bedrooms: number
  bathrooms: number
  kitchens?: number
  livingRooms?: number
  parking?: number
  price: number
  description: string
  type: string
  style: string
  floorPlanImages?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface QuotationItem {
  id: string
  category?: string
  materialName: string
  quantity: number
  unit: string
  materialPrice: number
  laborPrice: number
  pricePerUnit: number
  totalPrice: number
}

export interface Quotation {
  id: string
  quotationNumber?: string
  customerId: string
  customerName: string
  housePlanId: string
  housePlanName: string
  houseImage?: string
  floorPlanImages?: string[]
  area: number
  budget: string
  additionalRequirements: string
  items: QuotationItem[]
  totalMaterial?: number
  totalLabor?: number
  laborCost: number
  operationCost: number
  tax: number
  subtotal: number
  grandTotal: number
  notes: string
  conditions: string
  revisionNote?: string
  status: "pending" | "proposed" | "approved" | "rejected" | "revision_requested" | "revised"
  createdAt: string
  updatedAt: string
}

export interface Installment {
  installmentNumber: number
  amount: number
  dueDate: string
  description: string
  tasks?: string[]
}


export interface Address {
  houseNo: string
  village: string
  road: string
  subDistrict: string
  district: string
  province: string
}

export interface Contract {
  id: string
  contractNumber?: string
  customerId: string
  customerName: string
  customerAddress?: string
  customerAddressStructured?: Address
  customerPhone?: string
  contractorName?: string
  contractorAddress?: string
  contractorAddressStructured?: Address

  quotationId?: string
  housePlanName?: string
  houseImage?: string
  floorPlanImages?: string[]
  projectName: string
  projectDetails: string
  projectLocation?: string
  projectLocationStructured?: Address

  contractSignedDate?: string

  contractValue: number
  constructionPeriod: string
  startDate: string
  endDate: string

  items?: QuotationItem[] // Material list from Quotation

  installments?: Installment[]
  warrantyDetails?: string
  finePolicy?: string
  amendmentPolicy?: string

  status: "pending" | "accepted" | "completed"
  acceptedAt?: string
  createdAt: string
}

export interface ChecklistItem {
  task: string
  completed: boolean
}

export interface ProgressMilestone {
  id: string
  phase: number
  description: string
  progressPercentage: number
  checklist?: {
    task: string
    completed: boolean
  }[]
  images: string[]
  updatedAt: string
  report?: string
  paymentAmount: number
  paymentStatus: "pending" | "waiting_verification" | "paid"
  paymentMethod?: "cash" | "transfer"
  paymentSlip?: string
  transferDate?: string
  paidAt?: string
  checkedAt?: string
}

export interface ProjectProgress {
  id: string
  contractId: string
  customerId: string
  projectName: string
  milestones: ProgressMilestone[]
  overallProgress: number
  createdAt: string
  updatedAt: string
  status: "progress" | "completed" | "pending"
}

export interface FinancialRecord {
  id: string
  projectId: string
  projectName: string
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  date: string
  referenceId?: string
  receiptImage?: string
  createdAt: string
}

export interface ContactInquiry {
  id: string
  name: string
  phone: string
  email: string
  message: string
  status?: "new" | "replied"
  createdAt: string
}

export interface ShowcaseProject {
  id: string
  name: string
  housePlanId?: string
  location: string
  description: string
  images: string[]
  completionDate: string
  price?: number
  bedrooms?: number
  bathrooms?: number
  kitchens?: number
  livingRooms?: number
  parking?: number
  area?: number
  ownerName?: string
  subImages?: string[]
  createdAt: string
  updatedAt: string
}
