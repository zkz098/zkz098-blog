import type { NavItemType } from '../navbar/NavTypes'

export interface SidebarConfig {
  author?: string
  description?: string
  avatar?: string
  social?: Record<string, string | SocialLink>
  menu?: NavItemType[] | MenuConfig
  state?: StateConfig
}

export interface StateConfig {
  posts?: number
  categories?: number
  tags?: number
  archiveUrl?: string
  categoryUrl?: string
  tagUrl?: string
}

export interface SocialLink {
  url: string
  icon: string
  color?: string
}

export type MenuConfig = Record<string, string | MenuItemConfig>

export interface MenuItemConfig {
  url?: string
  icon?: string
  children?: NavItemType[]
}

// TOC (Table of Contents) types
export interface TocItem {
  id: string
  text: string
  level: number
  children?: TocItem[]
}

// Related posts types
export interface RelatedPost {
  slug: string
  title: string
  date?: Date
  category?: string
}

// Quick navigation types
export interface QuickNavigation {
  prevUrl?: string
  prevTitle?: string
  nextUrl?: string
  nextTitle?: string
}

// Sidebar panel types
export type PanelType = 'overview' | 'related' | 'contents'

export interface PanelConfig {
  id: PanelType
  title: string
  hasContent: boolean
}

// Extended sidebar props for post pages
export interface PostSidebarProps {
  toc?: TocItem[]
  relatedPosts?: RelatedPost[]
  currentSlug?: string
  navigation?: QuickNavigation
}
