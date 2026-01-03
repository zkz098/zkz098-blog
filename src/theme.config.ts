// cannot use path alias here because unocss can not resolve it
import { defineConfig } from "./toolkit/themeConfig";
import avatar from "./assets/avatar.avif";

export default defineConfig({
  siteName: "ShokaX",
  nav: [
    {
      href: "/",
      text: "首页",
      icon: "i-ri-home-line",
    },
    {
      dropbox: true,
      text: "文章",
      href: "/posts",
      icon: "i-ri-quill-pen-fill",
      dropboxItems: [
        {
          href: "/categories",
          text: "分类",
          icon: "i-ri-book-shelf-fill",
        },
        {
          href: "/tags",
          text: "标签",
          icon: "i-ri-price-tag-3-fill",
        },
        {
          href: "/archives",
          text: "归档",
          icon: "i-ri-archive-line",
        },
      ],
    },
  ],
  brand: {
    title: "ShokaX",
    subtitle: "A modern blog theme",
    logo: "✨",
  },
  cover: {
    enableCover: true,
    enablePreload: true,
    // fixedCover: '/path/to/cover.jpg', // 固定封面模式
    // gradient: true, // 渐变模式
    enableNextGradientCover: false, // 文章导航使用渐变背景
  },
  sidebar: {
    author: "Your Name",
    description: "A brief introduction",
    avatar: avatar, // 使用ImageMetadata
    social: {
      github: {
        url: "https://github.com/yourname",
        icon: "i-ri-github-fill",
      },
      twitter: {
        url: "https://twitter.com/yourname",
        icon: "i-ri-twitter-x-line",
      },
      email: {
        url: "mailto:your@email.com",
        icon: "i-ri-mail-line",
      },
    },
  },
  footer: {
    since: 2025,
    icon: {
      name: "sakura rotate",
      color: "#ffc0cb",
    },
    count: true,
    powered: true,
    icp: {
      enable: true,
      // icon: '/beian-icon.png',
      icpnumber: "津ICP备2022001375号",
      // beian: '网安备案号',
      // recordcode: 'xxxxx',
    },
  },
  widgets: {
    randomPosts: true,
    recentComments: true,
  },
  home: {
    selectedCategories: [{ name: "Tutorial" }, { name: "Frontend" }],
    pageSize: 2,
  },
});
