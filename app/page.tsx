import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Users, DollarSign, FileText } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const features = [
    {
      icon: BarChart3,
      title: "Project Management",
      description: "Track your projects from start to finish",
      href: "/projects"
    },
    {
      icon: Users,
      title: "Client Management", 
      description: "Organize and manage your client relationships",
      href: "/clients"
    },
    {
      icon: DollarSign,
      title: "Payment Tracking",
      description: "Create invoices and track payments",
      href: "/payments"
    },
    {
      icon: FileText,
      title: "Reports & Analytics",
      description: "Get insights into your business performance",
      href: "/dashboard"
    }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Welcome to Ledgique
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your freelance business with powerful project management, 
            client tracking, and payment processing tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects/add">
                Create First Project
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group p-6 rounded-lg border bg-card hover:shadow-md transition-all duration-200 hover:border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 p-6 rounded-lg bg-muted/50 text-center">
          <h2 className="text-xl font-semibold mb-2">Quick Tips</h2>
          <p className="text-muted-foreground mb-4">
            Use keyboard shortcuts to navigate faster:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-3 py-1 bg-background rounded border">
              <kbd className="font-mono">⌘ + D</kbd> Dashboard
            </span>
            <span className="px-3 py-1 bg-background rounded border">
              <kbd className="font-mono">⌘ + P</kbd> Projects
            </span>
            <span className="px-3 py-1 bg-background rounded border">
              <kbd className="font-mono">⌘ + C</kbd> Clients
            </span>
            <span className="px-3 py-1 bg-background rounded border">
              <kbd className="font-mono">⌘ + N</kbd> New Project
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
