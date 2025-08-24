import type { Metadata } from "next"

type Props = {
  children: React.ReactNode
  params: Promise<{ channel: string }>
}

// Générer dynamiquement le titre
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { channel } = await params
    return {
        title: {
            default: `${channel} | Nostr Chat`,
            template: "%s | Nostr Chat",
        },
    }
}

// Layout Server Component
export default function ChannelLayout({ children }: Props) {
    return <>{children}</>
}
