import { defineConfig } from '@/toolkit/themeConfig'

export default defineConfig({
  siteName: 'ShokaX',
  nav: [
    {
      href: '/',
      text: 'Home',
      icon: 'i-ri-home-line',
    },
    {
      href: '/about',
      text: 'About',
      icon: 'i-ri-user-6-line',
    },
    {
      href: '/contact',
      text: 'Contact',
      icon: 'i-ri-mail-line',
    },
    {
      dropbox: true,
      text: 'Account',
      href: '/account',
      icon: 'i-ri-account-circle-line',
      dropboxItems: [
        {
          href: '/login',
          text: 'Login',
          icon: 'i-ri-login-circle-line',
        },
        {
          href: '/register',
          text: 'Register',
          icon: 'i-ri-survey-line',
        },
      ],
    },
  ],
  brand: {
    title: 'ShokaX',
    subtitle: 'A modern blog theme',
    logo: '✨',
  },
  cover: {
    enableCover: true,
    enablePreload: true,
    // fixedCover: '/path/to/cover.jpg', // 固定封面模式
    // gradient: true, // 渐变模式
    enableNextGradientCover: false, // 文章导航使用渐变背景
    covers: [
      'https://picsum.photos/1920/1080?random=1',
      'https://picsum.photos/1920/1080?random=2',
      'https://picsum.photos/1920/1080?random=3',
      'https://picsum.photos/1920/1080?random=4',
      'https://picsum.photos/1920/1080?random=5',
      'https://picsum.photos/1920/1080?random=6',
    ],
  },
  sidebar: {
    author: 'Your Name',
    description: 'A brief introduction',
    avatar: '/avatar.avif',
    social: {
      github: {
        url: 'https://github.com/yourname',
        icon: 'i-ri-github-fill',
      },
      twitter: {
        url: 'https://twitter.com/yourname',
        icon: 'i-ri-twitter-x-line',
      },
      email: {
        url: 'mailto:your@email.com',
        icon: 'i-ri-mail-line',
      },
    }
  },
  footer: {
    since: 2022,
    icon: {
      name: 'sakura rotate',
      color: '#ffc0cb',
    },
    count: true,
    powered: true,
    icp: {
      enable: false,
      // icon: '/beian-icon.png',
      // icpnumber: 'ICP12345678',
      // beian: '网安备案号',
      // recordcode: 'xxxxx',
    },
  },
  widgets: {
    randomPosts: true,
    recentComments: true,
  },
})
