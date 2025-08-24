import { memo } from "react"
import { User2, ChevronUp } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import { SidebarFooter, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Signin } from "@/components/signin"

import { storage } from "@/lib/storage"

import { useProfile } from "@/hooks/useProfile"

import packageJson from "../../package.json"
interface SidebarFooterProps {
  hasPubkey: boolean;
  pubkey: string | null;
}

export const AppSidebarFooter = memo(function AppSidebarFooter({
    hasPubkey,
    pubkey,
}: SidebarFooterProps) {
    const { profile } = useProfile({
        pubkey: pubkey ?? undefined,
        fallbackName: "Anonymous User",
    })

    const { setTheme } = useTheme()
    const router = useRouter()

    const handleSignOut = () => storage.removePubkey()
    const handleThemeChange = () => {
        const currentTheme = storage.getTheme()
        const newTheme = currentTheme === "dark" ? "light" : "dark"
        storage.setTheme(newTheme)
        setTheme(newTheme)
    }

    const handleCreateChannel = (channel: string) => {
        router.push(`/channel/${channel}`)
    }

    const displayName = profile?.displayName || profile?.display_name || profile?.name || "Anonymous User"

    return (
        <SidebarFooter>
            <div className="border-t border-muted my-2" />
            {hasPubkey ? (
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 />
                                    {displayName}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start" className="min-w-full w-[var(--radix-popper-anchor-width)] text-muted-foreground text-sm">
                                <DropdownMenuItem onClick={handleThemeChange}>
                                    <span>Theme</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCreateChannel(prompt("Enter channel name:") || "general")}>
                                    <span>Create Channel</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            ) : (
                <Signin />
            )}
            <div className="mt-2 text-xs text-muted-foreground text-center">
                Version {packageJson.version}
            </div>
        </SidebarFooter>
    )
})