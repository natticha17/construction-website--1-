import Link from "next/link"
import { Building2, Phone, Mail, MapPin, MessageCircle } from "lucide-react"

import { COMPANY_INFO } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-xl font-bold">Piak House Construction</span>
            <p className="text-sm text-sidebar-foreground/70">
              บริการรับเหมาก่อสร้างครบวงจร สร้างบ้าน ต่อเติม รีโนเวท ด้วยทีมงานมืออาชีพ ราคายุติธรรม
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">บริการของเรา</h3>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>ก่อสร้างบ้าน</li>
              <li>ต่อเติมบ้าน</li>
              <li>รีโนเวทบ้าน</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">ลิงก์ด่วน</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/house-plans" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  แบบบ้าน
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  ผลงานของเรา
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">ติดต่อเรา</h3>
            <ul className="space-y-3 text-sm text-sidebar-foreground/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{COMPANY_INFO.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>Line ID: {COMPANY_INFO.lineId}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
