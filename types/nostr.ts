import type { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk"

export type NostrTag = [string, ...string[]];

export interface NostrChannelTag extends Array<string> {
  0: "g" | "d";
  1: string;
}

export interface NostrEventBase {
  id?: string;
  kind?: NDKKind;
  content: string;
  tags: NostrTag[];
  created_at?: number;
  pubkey?: string;
  sig?: string;
}

export interface NostrChatEvent extends NostrEventBase {
  created_at: number;
}

export interface NostrProfile {
  name?: string;
  display_name?: string;
  displayName?: string;
  about?: string;
  picture?: string;
  banner?: string;
  nip05?: string;
  lud06?: string;
  lud16?: string;
  website?: string;
}

export interface ChannelInfo {
  name: string;
  lastMessage?: NostrChatEvent;
  lastRead: number;
  hasUnread: boolean;
  messageCount: number;
}

export interface ChannelGroup {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

export interface MessageItemProps {
  event: NostrChatEvent;
  showAvatar?: boolean;
  compact?: boolean;
}

export interface SidebarChannelItemProps {
  channel: string;
  hasUnread: boolean;
  mounted: boolean;
}

export interface ChannelHeaderProps {
  channel: string;
}

export interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export interface FavoriteButtonProps {
  channel: string;
  size?: "sm" | "md" | "lg";
}

export interface NostrEventsContextType {
  events: NDKEvent[];
  eose: boolean;
  isLoading: boolean;
  error?: string;
}

export interface FavoritesContextType {
  favorites: string[];
  addFavorite: (channel: string) => void;
  removeFavorite: (channel: string) => void;
  isFavorite: (channel: string) => boolean;
  toggleFavorite: (channel: string) => void;
}

export interface UseUnreadMessagesReturn {
  unreadCount: number;
  hasUnread: boolean;
  markAsRead: () => void;
  getUnreadChannels: () => string[];
}

export interface UseProfileReturn {
  profile: NostrProfile | null;
  loading: boolean;
  error?: string;
}

export interface UseChannelMessagesReturn {
  messages: NostrChatEvent[];
  loading: boolean;
  error?: string;
  sendMessage: (content: string) => Promise<void>;
  hasMore: boolean;
  loadMore: () => void;
}

export interface NostrError {
  code: string;
  message: string;
  details?: unknown;
}

export type NostrErrorType = 
  | "CONNECTION_FAILED"
  | "PUBLISH_FAILED"
  | "SIGN_FAILED"
  | "INVALID_EVENT"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export interface NotificationData {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type Theme = "light" | "dark" | "system";

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type MessageEventHandler = (event: NostrChatEvent) => void;
export type ErrorEventHandler = (error: NostrError) => void;
export type ChannelEventHandler = (channel: string) => void;