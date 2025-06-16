import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, Grid, History, Lightbulb, Upload } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Smart Wardrobe Assistant
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Upload your clothing items and our AI will categorize them, suggest stylish outfit combinations, and
                  help you track your fashion history.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/upload">
                    <Button size="lg">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Garments
                    </Button>
                  </Link>
                  <Link href="/gallery">
                    <Button size="lg" variant="outline">
                      <Grid className="mr-2 h-4 w-4" />
                      View Gallery
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-video overflow-hidden rounded-xl">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Fashion collage"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy to organize your wardrobe, discover new outfit combinations, and track your
                  fashion history.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Upload</h3>
                <p className="text-muted-foreground">
                  Upload photos of your clothing items through our simple interface.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Grid className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Categorize</h3>
                <p className="text-muted-foreground">
                  Our AI automatically categorizes your items by type with the ability to edit if needed.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Discover</h3>
                <p className="text-muted-foreground">
                  Browse outfit ideas and find inspiration for your personal style.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <History className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Track</h3>
                <p className="text-muted-foreground">Keep a history of your favorite outfits and when you wore them.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:justify-between md:py-0">
          <div className="text-xs text-muted-foreground">© 2024 FashionAI. All rights reserved.</div>
          <nav className="flex gap-4 text-xs text-muted-foreground">
            <Link href="#">Terms</Link>
            <Link href="#">Privacy</Link>
            <Link href="#">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
