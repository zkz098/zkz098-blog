/* 
本文件是针对 Astro 内容合集图像默认值问题的一个 hack 
在当前版本中，Astro 内容合集事实上无法正确指定 default 值
当为 string时 Image 组件无法接受，为 object 时无法通过 Zod 校验
如果后续版本修复了此问题，可以将本函数安全地替换为post.data.cover
*/

import { sample } from "es-toolkit";
import type { Post } from "./types";
import themeConfig from "@/theme.config";
import type { ImageMetadata } from "astro";

export function getPostCover(post: Post): ImageMetadata{
  if (post.data.cover){
    return post.data.cover
  }

  return sample(themeConfig.cover?.covers ?? [])
}