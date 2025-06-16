import Link from "next/link"

export function Footer() {
  return (
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
  )
}
