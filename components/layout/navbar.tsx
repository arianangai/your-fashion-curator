import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, Upload } from "lucide-react"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Camera className="h-6 w-6" />
          <span>FashionAI</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="font-medium">
            Home
          </Link>
          <Link href="/upload" className="font-medium">
            Upload
          </Link>
          <Link href="/gallery" className="font-medium">
            Gallery
          </Link>
          <Link href="/ideas" className="font-medium">
            Outfit Ideas
          </Link>
          <Link href="/history" className="font-medium">
            History
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
