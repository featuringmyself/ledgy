"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Users, FileText, DollarSign, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      icon: FileText,
      label: "New Project",
      href: "/projects/add",
      color: "bg-primary hover:bg-primary/90"
    },
    {
      icon: Users,
      label: "New Client", 
      href: "/clients/add",
      color: "bg-primary hover:bg-primary/90"
    },
    {
      icon: DollarSign,
      label: "New Invoice",
      href: "/payments/add", 
      color: "bg-primary hover:bg-primary/90"
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
      <div className={cn(
        "flex flex-col-reverse items-end gap-3 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      )}>
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Button
              key={action.label}
              asChild
              size="lg"
              className={cn(
                "rounded-full shadow-lg h-12 w-12 text-white transition-all duration-200",
                action.color,
                "hover:scale-105"
              )}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : `${(actions.length - index - 1) * 50}ms`
              }}
            >
              <Link href={action.href} aria-label={action.label}>
                <Icon className="w-5 h-5" />
              </Link>
            </Button>
          )
        })}
      </div>
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
          "rounded-full shadow-lg h-14 w-14 mt-3 transition-all duration-200",
          "hover:scale-105",
          isOpen && "rotate-45"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>
    </div>
  )
}