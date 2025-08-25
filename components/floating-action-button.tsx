"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const actionMap: Record<string, { href: string; label: string }> = {
  "/dashboard": { href: "/projects/add", label: "New Project" },
  "/projects": { href: "/projects/add", label: "New Project" },
  "/clients": { href: "/clients/add", label: "New Client" },
  "/payments": { href: "/payments/add", label: "New Invoice" },
}

export function FloatingActionButton() {
  const pathname = usePathname()
  const action = actionMap[pathname]

  if (!action) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      <Button
        asChild
        size="lg"
        className="rounded-full shadow-lg h-14 w-14 hover:scale-105 transition-transform"
      >
        <Link href={action.href} aria-label={action.label}>
          <Plus className="w-6 h-6" />
        </Link>
      </Button>
    </div>
  )
}