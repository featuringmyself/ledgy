"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import logo from "@/public/logo.png"
type SubItem = {
  label: string;
  href: string;
};

type MenuItem = {
  label: string;
  href: string;
  children?: SubItem[];
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "Projects",
    href: "/projects",
    children: [
      { label: "Add", href: "/projects/add" },
      { label: "List", href: "/projects" },
      { label: "Overview", href: "/projects/overview" },
      { label: "Reports", href: "/projects/reports" }
    ]
  },
  {
    label: "Payments",
    href: "/payments",
    children: [
      { label: "Overview", href: "/payments" },
      { label: "Create Invoice", href: "/payments/add" },
      { label: "Milestones", href: "/payments/milestones" },
      { label: "Transactions", href: "/payments/transactions" },
      { label: "Record Payment", href: "/payments/transactions/add" }
    ]
  },
  {
    label: "Clients",
    href: "/clients",
    children: [
      { label: "List", href: "/clients" },
      { label: "Add", href: "/clients/add" }
    ]
  },
  {
    label: "Settings",
    href: "/settings",
    children: [
      { label: "Profile", href: "/settings/profile" },
      { label: "Billing", href: "/settings/billing" }
    ]
  },
  { label: "Help", href: "/help" }
];

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const expandedLabels = useMemo(() => {
    const labels = new Set<string>();
    for (const item of menuItems) {
      if (pathname === item.href || pathname.startsWith(item.href + "/")) {
        labels.add(item.label);
      }
      // Special case for dynamic routes
      if (item.href === "/clients" && pathname.match(/^\/clients\/\d+$/)) {
        labels.add(item.label);
      }
      if (item.href === "/projects" && pathname.match(/^\/projects\/\d+$/)) {
        labels.add(item.label);
      }
      if (item.href === "/payments" && pathname.match(/^\/payments\/\d+$/)) {
        labels.add(item.label);
      }
    }
    return labels;
  }, [pathname]);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Ledgique"
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg"
          />

        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={classNames(
        "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-lg",
        "lg:h-screen lg:sticky lg:top-0 lg:w-64",
        "lg:translate-x-0 transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "fixed inset-y-0 left-0 z-50 w-64 translate-x-0" : "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full lg:translate-x-0"
      )}>
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-700 hidden lg:block">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="Ledgique"

              className="w-auto h-8 rounded-lg"
            />

          </div>
        </div>
        <nav className="p-4 h-full overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isExpanded = expandedLabels.has(item.label);
              const isActive = pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={
                      classNames(
                        "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 touch-manipulation group",
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      )
                    }
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.children && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={classNames(
                          "h-4 w-4 transition-transform duration-200",
                          isExpanded && "rotate-90"
                        )}
                      >
                        <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    )}
                  </Link>
                  {item.children && isExpanded && (
                    <ul className="mt-2 ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={
                                classNames(
                                  "block px-3 py-2 text-sm rounded-lg transition-all duration-200 touch-manipulation",
                                  isChildActive
                                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                )
                              }
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
