import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">MarcoPolo</h1>
        <ThemeToggle />
      </header>
      <main className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 dark:text-white">Welcome to MarcoPolo</h2>
          <p className="text-xl mb-8 dark:text-gray-300">
            Discover the most resilient combinations of vantage point locations for your certificate authority cloud infrastructure
          </p>
          <Link href="/recommendations">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </main>
      <footer className="p-4 bg-gray-800 text-white text-center">
        <p>&copy; 2025 MarcoPolo. All rights reserved.</p>
      </footer>
    </div>
  )
}

