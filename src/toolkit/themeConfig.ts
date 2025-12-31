import type { NavItemType } from "@/components/navbar/NavTypes";
import type { SidebarConfig } from "@/components/sidebar/SidebarTypes";

interface BrandConfig {
  // 首页大标题
  title?: string;
  // 首页副标题
  subtitle?: string;
  // 首页 Logo，可以是文本或emoji
  logo?: string;
}

interface CoverConfig {
  // 是否启用封面
  enableCover?: boolean;
  // 是否启用预加载
  enablePreload?: boolean;
  fixedCover?: string;
  gradient?: boolean;
  enableNextGradientCover?: boolean;
  inferImageSize?: boolean;
}

interface FooterConfig {
  since?: number;
  icon?: {
    name?: string;
    color?: string;
  };
  count?: boolean;
  powered?: boolean;
  icp?: {
    enable?: boolean;
    icon?: string;
    icpnumber?: string;
    beian?: string;
    recordcode?: string;
  };
}

interface WidgetsConfig {
  randomPosts?: boolean;
  recentComments?: boolean;
}

interface HomeConfig {
  selectedCategories?: {
    name: string;
    cover?: string;
  }[];
}

export interface ShokaXThemeConfig {
  siteName: string;
  nav: NavItemType[];
  sidebar?: SidebarConfig;
  brand?: BrandConfig;
  cover?: CoverConfig;
  footer?: FooterConfig;
  widgets?: WidgetsConfig;
  home?: HomeConfig;
}

export function defineConfig(config: ShokaXThemeConfig) {
  return config;
}
