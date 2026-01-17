import type { AstroIntegration } from "astro";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import type { HyacinePluginSystemConfig } from "../plugins/config";
import type {
  CustomElementEntry,
  PluginManifest,
  RuntimeOnlyEntry,
  SSREntry,
} from "../plugins/plugin";
import {
  generateTempAstroTemplateFile,
  generateTempRuntimeFile,
} from "../plugins/helper/generateTempFile";

/**
 * 读取插件配置文件
 * 支持 hyacine.plugin.ts 和 hyacine.plugin.mjs
 */
async function loadPluginConfig(root: URL): Promise<HyacinePluginSystemConfig | null> {
  const rootPath = root.pathname;
  const tsConfigPath = join(rootPath, "hyacine.plugin.ts");
  const mjsConfigPath = join(rootPath, "hyacine.plugin.mjs");

  let configPath: string | null = null;

  if (existsSync(tsConfigPath)) {
    configPath = tsConfigPath;
  } else if (existsSync(mjsConfigPath)) {
    configPath = mjsConfigPath;
  }

  if (!configPath) {
    console.warn("[hyacine-plugin] 未找到插件配置文件 (hyacine.plugin.ts 或 .mjs)");
    return null;
  }

  try {
    // 使用动态导入加载配置文件
    const configModule = await import(pathToFileURL(configPath).href);
    const config = configModule.default as HyacinePluginSystemConfig;

    if (!config || !config.plugins) {
      console.warn("[hyacine-plugin] 配置文件格式无效，缺少 plugins 字段");
      return null;
    }

    return config;
  } catch (error) {
    console.error("[hyacine-plugin] 加载配置文件失败:", error);
    return null;
  }
}

/**
 * 将插件列表转换为 manifest 列表
 */
function getPluginManifests(config: HyacinePluginSystemConfig): PluginManifest[] {
  const context = {
    injectPoints: config.injectPoints,
  };
  return config.plugins.map((p) => p.plugin(p.options, context));
}

/**
 * 按照 injectPoint 对 entry 进行分组
 */
function groupEntriesByInjectPoint(
  manifests: PluginManifest[],
): Map<string, Array<SSREntry | CustomElementEntry>> {
  const groups = new Map<string, Array<SSREntry | CustomElementEntry>>();

  for (const manifest of manifests) {
    for (const entry of manifest.entry) {
      if (entry.type === "runtime-only") {
        // runtime-only 单独处理，不在这里分组
        continue;
      }

      const injectPoint = entry.injectPoint;
      if (!groups.has(injectPoint)) {
        groups.set(injectPoint, []);
      }
      groups.get(injectPoint)!.push(entry);
    }
  }

  return groups;
}

/**
 * 收集所有 runtime-only 类型的 entry
 */
function getRuntimeOnlyEntries(manifests: PluginManifest[]): RuntimeOnlyEntry[] {
  const entries: RuntimeOnlyEntry[] = [];

  for (const manifest of manifests) {
    for (const entry of manifest.entry) {
      if (entry.type === "runtime-only") {
        entries.push(entry);
      }
    }
  }

  return entries;
}

/**
 * 生成文件并写入磁盘
 */
async function generateFiles(
  root: URL,
  groups: Map<string, Array<SSREntry | CustomElementEntry>>,
  runtimeEntries: RuntimeOnlyEntry[],
  config: HyacinePluginSystemConfig,
): Promise<void> {
  const rootPath = root.pathname;
  const outputDir = join(rootPath, "generated", "hyacine");

  // 确保输出目录存在
  await mkdir(outputDir, { recursive: true });

  // 生成每个 inject point 对应的 Astro 文件
  for (const [injectPoint, entries] of groups) {
    const fileName = `${injectPoint}.astro`;
    const filePath = join(outputDir, fileName);
    const content = generateTempAstroTemplateFile(entries);

    await writeFile(filePath, content, "utf-8");
    console.log(`[hyacine-plugin] 已生成: ${fileName}`);
  }

  // 生成 runtime.ts 文件
  if (runtimeEntries.length > 0) {
    const runtimePath = join(outputDir, "runtime.ts");
    const content = generateTempRuntimeFile(runtimeEntries, config.injectPoints);

    await writeFile(runtimePath, content, "utf-8");
    console.log(`[hyacine-plugin] 已生成: runtime.ts`);
  }
}

/**
 * Hyacine 插件系统 Astro 集成
 */
export default function hyacinePlugin(): AstroIntegration {
  return {
    name: "hyacine-plugin",
    hooks: {
      "astro:build:start": async ({ logger }) => {
        const root = new URL(`file://${process.cwd()}/`);

        logger.info("开始生成插件文件...");

        // 1. 读取配置
        const config = await loadPluginConfig(root);
        if (!config) {
          logger.warn("未找到有效的插件配置，跳过生成");
          return;
        }

        // 2. 获取所有插件的 manifest
        const manifests = getPluginManifests(config);
        logger.info(`发现 ${manifests.length} 个插件`);

        // 3. 按 inject point 分组
        const groups = groupEntriesByInjectPoint(manifests);
        const runtimeEntries = getRuntimeOnlyEntries(manifests);

        // 4. 生成文件
        await generateFiles(root, groups, runtimeEntries, config);

        logger.info("插件文件生成完成!");
      },
    },
  };
}
