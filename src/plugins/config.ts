import type { PluginManifest } from "./plugin";

/**
 * 插件上下文，提供给插件函数使用的全局信息
 */
export interface PluginContext {
  /** CSS 选择器映射表 */
  injectPoints: injectPoints;
}

export interface Plugin<O> {
  plugin: (options: O, context: PluginContext) => PluginManifest;
  options: O;
}

export function definePlugin<O>(plugin: Plugin<O>): Plugin<O> {
  return plugin;
}

export type injectPoint =
  | "head"
  | "layout"
  | "right-nav"
  | "left-nav"
  | "post-meta"
  | "sidebar"
  | "footer"
  | "widgets"
  | "post-footer"
  | "comment"
  | "footer-status"
  | "toolbar"
  | "segments-sticky";

export type injectPoints = Record<string, string> & Partial<Record<injectPoint, string>>;

export interface HyacinePluginSystemConfig {
  injectPoints: injectPoints;
  plugins: Plugin<unknown>[];
}

export function defineConfig(config: HyacinePluginSystemConfig): HyacinePluginSystemConfig {
  return config;
}
