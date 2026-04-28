import { Providers } from "@/components/providers"
import "./globals.css"
import { GeistSans } from "geist/font/sans"

export const metadata = {
    title: "Home Server Dashboard",
    description: "Dashboard",
}

export const viewport = {
    width: "device-width",
    initialScale: 1,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${GeistSans.className} bg-background text-foreground antialiased`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}