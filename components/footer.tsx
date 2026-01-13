import Link from "next/link"
import { Building2, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">บ้านสร้างฝัน</span>
            </Link>
            <p className="text-sm text-sidebar-foreground/70">
              บริการรับเหมาก่อสร้างครบวงจร ออกแบบบ้าน สร้างบ้าน ต่อเติม รีโนเวท ด้วยทีมงานมืออาชีพ ราคายุติธรรม
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">บริการของเรา</h3>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>ออกแบบบ้าน</li>
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
                <span>02-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@baansangfun.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/50">
          <p>© {new Date().getFullYear()} บ้านสร้างฝัน. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </footer>
  )
}
