"use client"

import Link from "next/link"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function HomePage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-2">
            <Card className="w-full max-w-6xl shadow-lg">
                <CardHeader>
                    <SidebarTrigger variant="outline" className="h-12 w-12" />
                    <CardTitle className="text-4xl font-bold mb-2 text-center">Nostr Chat NDK</CardTitle>
                    <p className="text-muted-foreground text-center">
                        Decentralized instant messaging — open source, privacy, resilience, freedom of speech.
                    </p>
                </CardHeader>
                <Separator className="my-6" />
                <CardContent>
                    <div className="flex flex-col gap-8 md:flex-row md:gap-12">
                        <div className="flex-1 flex flex-col gap-8">
                            <section>
                                <h2 className="text-2xl font-semibold mb-2">Main Features</h2>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li>Real-time chat on Nostr channels</li>
                                    <li>Secure login with your Nostr key</li>
                                    <li>Unread message tracking per channel</li>
                                    <li>Favorites: mark and quickly find your favorite channels</li>
                                    <li>Modern interface: light/dark themes, responsive design, badges, auto-scroll</li>
                                    <li>Multi-relay support for resilience</li>
                                </ul>
                            </section>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2">Why choose Nostr Chat NDK?</h2>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li>No central server: your exchanges are not controlled or stored by a third party</li>
                                    <li>Open source: anyone can review the code, contribute, or propose improvements</li>
                                    <li>Privacy: no accounts, no ads, no tracking</li>
                                    <li>Resistant to censorship and outages</li>
                                </ul>
                            </section>
                        </div>
                        <div className="flex-1 flex flex-col gap-8">
                            <section>
                                <h2 className="text-2xl font-semibold mb-2">Relays Used</h2>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li><code>wss://relay.primal.net</code></li>
                                    <li><code>wss://relay.damus.io</code></li>
                                    <li><code>wss://nos.lol</code></li>
                                    <li><code>wss://relay.snort.social</code></li>
                                </ul>
                            </section>
                            <section>
                                <h2 className="text-2xl font-semibold mb-2">Nostr Kinds Listened To</h2>
                                <p>
                                    The application focuses on channel chat-specific kinds:
                                </p>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li><b>Kind 20000 and 23333</b>: Nostr channel message events</li>
                                </ul>
                                <p className="mt-2 text-muted-foreground">
                                    These kinds enable efficient conversation handling and advanced social features.
                                </p>
                            </section>
                            <section className="text-center mt-8">
                                <h2 className="text-2xl font-semibold mb-2">Open Source</h2>
                                <p>
                                    Check out the code, share ideas, or contribute on&nbsp;:
                                </p>
                                <Button asChild className="mt-4 w-full">
                                    <Link href="https://github.com/TonyKun7/nostr-chat-ndk" target="_blank" rel="noopener">
                                        View GitHub Repo
                                    </Link>
                                </Button>
                            </section>
                        </div>
                    </div>
                    <Separator className="my-8" />
                    <section className="text-center">
                        <h2 className="text-2xl font-semibold mb-2">Support the Project</h2>
                        <p>
                            If you enjoy Nostr Chat NDK, you can support development by sending a Lightning donation&nbsp;:
                        </p>
                        <div className="mt-4 flex flex-col items-center justify-center">
                            <span className="font-mono bg-muted px-4 py-2 rounded-lg text-lg mb-2">
                                ⚡ <b>tonykun@coinos.io</b>
                            </span>
                            <Button asChild variant="outline" className="w-fit">
                                <a href="https://coinos.io/tonykun" target="_blank" rel="noopener">
                                    Send a Lightning Donation
                                </a>
                            </Button>
                        </div>
                        <p className="mt-2 text-muted-foreground text-sm">
                            Lightning address (LNURL) compatible with all apps and wallets. Thanks for your support!
                        </p>
                    </section>
                </CardContent>
            </Card>
        </main>
    )
}
