import type { NavItemType } from "@/components/navbar/NavTypes";
import type { SidebarConfig } from "@/components/sidebar/SidebarTypes";
import type { Locale } from "@/i18n";

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

  /** 首页分页：每页文章数量（不含置顶文章） */
  pageSize?: number;
}

export interface ShokaXThemeConfig {
  siteName: string;
  locale?: Locale; // 网站语言设置，默认为 zh-CN
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
