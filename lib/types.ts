// Types for the construction management system

export interface User {
  id: string
  email: string
  password: string // In production, this should be hashed
  name: string
  phone: string
  address: string
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
  price: string
  description: string
  features: string[]
}

export interface QuotationItem {
  id: string
  materialName: string
  quantity: number
  unit: string
  pricePerUnit: number
  totalPrice: number
}

export interface Quotation {
  id: string
  customerId: string
  customerName: string
  housePlanId: string
  housePlanName: string
  area: number
  budget: string
  materialType: string
  additionalRequirements: string
  items: QuotationItem[]
  laborCost: number
  operationCost: number
  tax: number
  subtotal: number
  grandTotal: number
  notes: string
  conditions: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

export interface Contract {
  id: string
  customerId: string
  customerName: string
  quotationId: string
  projectName: string
  projectDetails: string
  contractValue: number
  constructionPeriod: string
  startDate: string
  endDate: string
  status: "pending" | "accepted" | "completed"
  acceptedAt?: string
  createdAt: string
}

export interface ProgressMilestone {
  id: string
  phase: number
  description: string
  progressPercentage: number
  images: string[]
  updatedAt: string
  paymentAmount: number
  paymentStatus: "pending" | "paid"
  paidAt?: string
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
  createdAt: string
}

export interface ContactInquiry {
  id: string
  name: string
  phone: string
  email: string
  message: string
  createdAt: string
}
