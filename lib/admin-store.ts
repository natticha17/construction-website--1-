import type { HousePlan, ContactInquiry } from "./data"
import { housePlans as initialHousePlans } from "./data"

// In-memory store for demo purposes
// Will be replaced with database integration

class AdminStore {
  private housePlans: HousePlan[] = [...initialHousePlans]
  private inquiries: ContactInquiry[] = []

  // House Plans CRUD
  getHousePlans(): HousePlan[] {
    return this.housePlans
  }

  getHousePlan(id: string): HousePlan | undefined {
    return this.housePlans.find((p) => p.id === id)
  }

  addHousePlan(plan: Omit<HousePlan, "id">): HousePlan {
    const newPlan = {
      ...plan,
      id: Date.now().toString(),
    }
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

  // Inquiries
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

export const adminStore = new AdminStore()
