// cannot use path alias here because unocss can not resolve it
import { defineConfig } from "./toolkit/themeConfig";

export default defineConfig({
  siteName: "zkz098's blog",
  locale: "zh-CN", // 网站语言: "zh-CN" | "en"
  nav: [
    {
      href: "/",
      text: "首页",
      icon: "i-ri-home-line",
    },
    {
      text: "文章",
      href: "/posts/",
      icon: "i-ri-quill-pen-fill",
      dropbox: {
        enable: true,
        items: [
          {
            href: "/categories/",
            text: "分类",
            icon: "i-ri-book-shelf-fill",
          },
          {
            href: "/tags/",
            text: "标签",
            icon: "i-ri-price-tag-3-fill",
          },
          {
            href: "/archives/",
            text: "归档",
            icon: "i-ri-archive-line",
          },
        ],
      },
    },
    {
      text: "友链",
      href: "/friends/",
      icon: "i-ri-link",
    },
  ],
  brand: {
    title: "zkz098's blog",
    subtitle: "A modern blog theme",
    logo: "✨",
  },
  cover: {
    enable: true,
    preload: true,
    // 固定封面模式（可选）：
    // - enable: 是否启用固定封面
    // - url: 推荐填 "cover-1" ~ "cover-6"（来自 src/components/Images.astro 预设），
    //        或者填 public 路径/远程 URL（会使用 <img> 兜底渲染）
    fixedCover: {
      enable: true,
      url: "https://img.cdn.kaitaku.xyz/cover-1.avif",
    },
    gradient: false,
    nextGradientCover: false, // 文章导航使用渐变背景
  },
  sidebar: {
    author: "zkz098",
    description: "A brief introduction",
    social: {
      github: {
        url: "https://github.com/zkz098",
        icon: "i-ri-github-fill",
        color: "#191717",
      },
      email: {
        url: "mailto:zkz20081204@126.com",
        icon: "i-ri-mail-line",
        color: "#55acd5",
      },
      stackoverflow: {
        url: "https://stackoverflow.com/users/19941267/kaitaku",
        icon: "i-ri-stack-overflow-line",
      },
    },
  },
  footer: {
    since: 2021,
    icon: {
      name: "sakura rotate",
      color: "#ffc0cb",
    },
    count: true,
    powered: true,
    icp: {
      enable: true,
      icon: "/beian.webp",
      icpnumber: "津ICP备2022001375号",
      beian: "津公网安备 12011402001353号",
      recordcode: "12011402001353",
    },
  },
  widgets: {
    randomPosts: true,
    recentComments: true,
    recentCommentsLimit: 10,
  },
  comments: {
    enable: false,
    waline: {
      // 替换为你的 Waline 服务端地址，例如: https://comments.example.com
      serverURL: "",
      // 推荐与站点语言保持一致
      lang: "zh-CN",
    },
  },
  nyxPlayer: {
    enable: false,
    preset: "shokax",
    darkModeTarget: ':root[data-theme="dark"]',
    urls: [
      {
        name: "列表1",
        url: "https://music.163.com/#/playlist?id=2943811283",
      },
      {
        name: "列表2",
        url: "https://music.163.com/#/playlist?id=2031842656",
      },
    ],
  },
  visibilityTitle: {
    enable: false,
    leaveTitle: "👀 你先忙，我等你回来~",
    returnTitle: "🎉 欢迎回来！",
    restoreDelay: 3000,
  },
  home: {
    selectedCategories: [{ name: "网站建设" }],
    pageSize: 10,
  },
  friends: {
    title: "友链",
    description: "zkz098 的朋友们",
    avatar: "https://www.kaitaku.xyz/assets/avatar.avif",
    color: "#00BFFF",
    links: [
      {
        url: "https://seachen.cn",
        title: "昨夜星辰",
        desc: "日月之行，星汉灿烂",
        author: "DreamStaro",
        avatar: "https://fastly.jsdelivr.net/gh/DreamStar1996/ImageHub-CDN@1.1.3/Bg-Phtoto/20.jpg",
        color: "#00FFFF",
      },
      {
        url: "https://www.imaegoo.com",
        title: "iMaeGoo’s Blog",
        desc: "虹墨空间站",
        author: "iMaeGoo",
        avatar: "https://www.imaegoo.com/images/avatar.jpg",
        color: "#B0E0E6",
      },
      {
        url: "https://haroldpopo.github.io",
        title: "Harold's Blog",
        desc: "我踏清风寻杨柳，谁有龙虾谁有酒。清风深知杨柳意，啤酒龙虾又相聚。",
        author: "Harold",
        avatar: "https://haroldpopo.github.io/images/avatar.jpg",
        color: "#F65327",
      },
      {
        url: "https://moeyy.cn/",
        title: "Moeyy's Blog",
        desc: "一个小博客",
        author: "moeyy",
        avatar: "https://moeyy.cn/logourl",
        color: "#F9B907",
      },
      {
        url: "https://jiankychen.github.io/",
        title: "Jiankychen's Blog",
        desc: "Never put off till tomorrow what you can do today.",
        author: "Jiankychen",
        avatar:
          "https://cdn.jsdelivr.net/gh/jiankychen/jiankychen.github.io@master/images/avatar.jpg",
        color: "#9DBFD8",
      },
      {
        url: "https://www.shimoko.com/",
        title: "Shimoko",
        desc: "轨迹改变角度交错，寂寞城市又在探戈",
        author: "Shimoko",
        avatar: "https://img.shimoko.com/shimocat.jpg",
        color: "#3F51B5",
      },
      {
        url: "https://www.yotroy.cool/",
        title: "𝖄𝕺🌎𝕿𝕽𝕺¥",
        desc: "𝕴 𝖉𝖔 𝖒𝖆𝖌𝖎𝖈",
        author: "rTwTroy",
        avatar: "https://file.yotroy.cool/logo.png",
        color: "#FF00AE",
      },
      {
        url: "https://test19124.github.io",
        title: "lzs's Blog",
        desc: "一个学生的小博客&学习笔记",
        author: "test19124",
        avatar: "https://test19124.github.io/assets/avatar.png",
        color: "#00BFFF",
      },
      {
        url: "https://blog.moeqy.com/",
        title: "MqyGalaxy|Blog",
        desc: "爱好 ACG 的温馨小窝",
        author: "MqyGalaxy",
        avatar: "https://cravatar.cn/avatar/73426b309c6e3ef2cf3a82ff23353351",
        color: "#FFB6C1",
      },
      {
        url: "https://blog.twelveeee.top",
        title: "十二的编程笔记",
        desc: "十二的编程笔记",
        author: "Twelveeee",
        avatar: "https://twelveeee-top.oss-cn-beijing.aliyuncs.com/images/avatar.jpg",
        color: "#cd6562",
      },
      {
        url: "https://www.akyuu.cc/",
        title: "轩缈喵のAkyuu",
        desc: "一个平凡人的求闻史记",
        author: "轩缈喵读作喵喵喵",
        avatar: "https://www.akyuu.cc/about/profile.jpg",
        color: "#FFE1FF",
      },
      {
        url: "https://turou.fun/",
        title: "兔肉的随笔",
        desc: "空を見ろ。空を見続けろ。答えはそこにある",
        author: "兔肉",
        avatar: "https://turou.fun/assets/avatar.webp",
        color: "#55ACD5",
      },
      {
        url: "https://caelum.moe/",
        title: "Greyflowers",
        desc: "『灰色的花，终有一天会盛开吧。』",
        author: "non_hana",
        avatar: "https://caelum.moe/_ipx/q_85/images/avatar.webp",
        color: "#858585",
      },
    ],
  },
  copyright: {
    license: "CC-BY-NC-ND-4.0",
    show: true,
  },
});
