import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import NDKHeadless from "@/components/ndk"
import { AppSideBar } from "@/components/app-sidebar"
import { NostrEventsProvider } from "@/context/Nostr"
import { FavoritesProvider } from "@/context/Favorite"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        default: "Nostr Chat",
        template: "%s | Nostr Chat",
    },
    description: "A decentralized chat built on Nostr",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-screen dark overflow-hidden" suppressHydrationWarning>
            <body className="w-screen h-screen overflow-hidden">
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <SidebarProvider>
                        <NostrEventsProvider>
                            <FavoritesProvider>
                                <div className="flex h-full w-full overflow-hidden">
                                    <AppSideBar />
                                    <main className="flex-1 flex flex-col h-full overflow-hidden">
                                        <NDKHeadless />
                                        {children}
                                    </main>
                                </div>
                            </FavoritesProvider>
                        </NostrEventsProvider>
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
