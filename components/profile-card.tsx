"use client";

import { User, Globe, Mail, Key, ExternalLink, Copy, Check, Zap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useProfileValue } from "@nostr-dev-kit/ndk-hooks";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ProfileCardProps = {
    pubkey: string;
    profile?: ReturnType<typeof useProfileValue>;
    children: React.ReactNode;
};

export function ProfileCard({ pubkey, profile, children }: ProfileCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyPubkey = async () => {
        try {
            await navigator.clipboard.writeText(pubkey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Erreur lors de la copie:', error);
        }
    };

    const displayName = profile?.displayName || profile?.display_name || profile?.name || "Utilisateur anonyme";
    const truncatedPubkey = `${pubkey.slice(0, 8)}...${pubkey.slice(-8)}`;

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent className="w-80 p-4 overflow-hidden" side="right" align="start" sideOffset={8} collisionPadding={10}>
                {profile ? (
                    <>
                        {profile.banner && (
                            <div className="relative h-20 overflow-hidden">
                                <Image src={profile.banner} alt="Bannière du profil" fill className="object-cover opacity-80 rounded-xl" />
                            </div>
                        )}

                        <div className="p-4 relative">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full p-0.5">
                                        {profile.picture ? (
                                            <Image src={profile.picture} alt="Avatar" width={48} height={48} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                                                <User className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    {profile.nip05 && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                            <Check className="w-2 h-2 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground mb-1 truncate">
                                        {displayName}
                                    </h3>
                                    {profile.nip05 && (
                                        <div className="flex items-center gap-1 text-xs text-emerald-600 mb-2">
                                            <Mail className="w-3 h-3" />
                                            <span className="truncate">{profile.nip05}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary" className="font-mono text-xs flex-1">
                                    <Key className="w-3 h-3 mr-1" />
                                    {truncatedPubkey}
                                </Badge>
                                <Button variant="ghost" size="sm" onClick={handleCopyPubkey} className="h-6 w-6 p-0" >
                                    {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                </Button>
                            </div>

                            {profile.about && (
                                <div className="mb-3">
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                        {profile.about}
                                    </p>
                                </div>
                            )}

                            <Separator className="my-3" />

                            <div className="space-y-2">
                                {profile.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline text-xs truncate flex items-center gap-1">
                                            {profile.website.replace(/^https?:\/\//, '')}
                                            <ExternalLink className="w-2 h-2" />
                                        </a>
                                    </div>
                                )}

                                {profile.lud16 && (
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                        <span className="text-muted-foreground font-mono text-xs truncate">
                                            {profile.lud16}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-sm text-muted-foreground">
                        Profil non disponible
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
