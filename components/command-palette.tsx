"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, Users, DollarSign, BarChart3, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Command {
  id: string
  label: string
  description?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  keywords: string[]
}

const commands: Command[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "View business overview",
    href: "/dashboard",
    icon: BarChart3,
    keywords: ["dashboard", "overview", "home", "stats"]
  },
  {
    id: "projects",
    label: "Projects",
    description: "Manage your projects",
    href: "/projects",
    icon: FileText,
    keywords: ["projects", "work", "tasks"]
  },
  {
    id: "new-project",
    label: "New Project",
    description: "Create a new project",
    href: "/projects/add",
    icon: FileText,
    keywords: ["new", "create", "project", "add"]
  },
  {
    id: "clients",
    label: "Clients",
    description: "Manage your clients",
    href: "/clients",
    icon: Users,
    keywords: ["clients", "customers", "contacts"]
  },
  {
    id: "new-client",
    label: "New Client",
    description: "Add a new client",
    href: "/clients/add",
    icon: Users,
    keywords: ["new", "create", "client", "add", "customer"]
  },
  {
    id: "payments",
    label: "Payments",
    description: "Manage invoices and payments",
    href: "/payments",
    icon: DollarSign,
    keywords: ["payments", "invoices", "money", "billing"]
  },
  {
    id: "new-invoice",
    label: "New Invoice",
    description: "Create a new invoice",
    href: "/payments/add",
    icon: DollarSign,
    keywords: ["new", "create", "invoice", "add", "bill"]
  },
  {
    id: "settings",
    label: "Settings",
    description: "App settings and preferences",
    href: "/settings",
    icon: Settings,
    keywords: ["settings", "preferences", "config"]
  },
  {
    id: "help",
    label: "Help",
    description: "Get help and support",
    href: "/help",
    icon: HelpCircle,
    keywords: ["help", "support", "docs", "documentation"]
  }
]

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(query.toLowerCase()) ||
    command.description?.toLowerCase().includes(query.toLowerCase()) ||
    command.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      } else if (e.key === "Escape") {
        setIsOpen(false)
        setQuery("")
        setSelectedIndex(0)
      } else if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
        } else if (e.key === "Enter") {
          e.preventDefault()
          const selected = filteredCommands[selectedIndex]
          if (selected) {
            router.push(selected.href)
            setIsOpen(false)
            setQuery("")
            setSelectedIndex(0)
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, router])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[20vh]">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="flex items-center border-b px-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-4 bg-transparent outline-none text-sm"
            autoFocus
          />
          <kbd className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            ESC
          </kbd>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No commands found
            </div>
          ) : (
            filteredCommands.map((command, index) => {
              const Icon = command.icon
              return (
                <button
                  key={command.id}
                  onClick={() => {
                    router.push(command.href)
                    setIsOpen(false)
                    setQuery("")
                    setSelectedIndex(0)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors",
                    index === selectedIndex && "bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{command.label}</div>
                    {command.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {command.description}
                      </div>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
        
        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <span>Use ↑↓ to navigate, Enter to select</span>
          <span>⌘K to open</span>
        </div>
      </div>
    </div>
  )
}