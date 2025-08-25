"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const shortcuts = [
  { key: "d", path: "/dashboard", description: "Go to Dashboard" },
  { key: "p", path: "/projects", description: "Go to Projects" },
  { key: "c", path: "/clients", description: "Go to Clients" },
  { key: "i", path: "/payments", description: "Go to Payments" },
  { key: "n", path: "/projects/add", description: "New Project" },
  { key: "shift+n", path: "/clients/add", description: "New Client" },
]

export function KeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if no input is focused and cmd/ctrl is pressed
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.target ||
        (event.target as HTMLElement).tagName !== "INPUT" &&
        (event.target as HTMLElement).tagName !== "TEXTAREA"
      ) {
        const shortcut = shortcuts.find(s => {
          if (s.key.includes("shift+")) {
            return event.shiftKey && event.key.toLowerCase() === s.key.replace("shift+", "")
          }
          return event.key.toLowerCase() === s.key
        })

        if (shortcut) {
          event.preventDefault()
          router.push(shortcut.path)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [router])

  return null
}