import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'
import themeConfig from './src/theme.config'

const iconSafeList = themeConfig.nav.flatMap((item) => {
  const icons: string[] = []
  if (item.icon) {
    icons.push(item.icon)
  }
  if (item.dropboxItems) {
    item.dropboxItems.forEach((subItem) => {
      if (subItem.icon) {
        icons.push(subItem.icon)
      }
    })
  }
  return icons
})

// Add sidebar social and menu icons to safelist
if (themeConfig.sidebar?.social) {
  Object.values(themeConfig.sidebar.social).forEach((value) => {
    const iconStr = typeof value === 'string' ? value.split('||')[1]?.trim() : value.icon
    if (iconStr) {
      const iconClass = iconStr.startsWith('i-') ? iconStr : `i-ri-${iconStr}`
      iconSafeList.push(iconClass)
    }
  })
}

if (themeConfig.sidebar?.menu) {
  Object.values(themeConfig.sidebar.menu).forEach((value) => {
    const iconStr = typeof value === 'string' ? value.split('||')[1]?.trim() : ''
    if (iconStr) {
      const iconClass = iconStr.startsWith('i-') ? iconStr : `i-ri-${iconStr}`
      iconSafeList.push(iconClass)
    }
  })
}

// Add common sidebar icons
const commonSidebarIcons = [
  'i-ri-home-2-fill',
  'i-ri-archive-2-line',
  'i-ri-price-tag-3-line',
  'i-ri-folder-2-line',
  'i-ri-information-line',
  'i-ri-mail-line',
  'i-ri-github-fill',
  'i-ri-twitter-x-line',
  'i-ri-facebook-circle-fill',
  'i-ri-menu-line',
  'i-ri-arrow-drop-down-fill',
  // Footer and widgets icons
  'i-ri-sakura',
  'i-sakura',
  'i-ri-chart-area',
  'i-ri-coffee',
  'i-ri-link-alt',
  // Post segment icons
  'i-ri-calendar-line',
  'i-ri-pencil-line',
  'i-ri-time-line',
  'i-ri-flag-line',
  // Brand postMeta icons
  'i-ri-quill-pen-line',
  // Post page icons
  'i-ri-home-fill',
  'i-ri-arrow-right-s-line',
  'i-ri-edit-2-line',
  'i-ri-calendar-check-line',
  'i-ri-heart-pulse-line',
  'i-ri-at-line',
  'i-ri-creative-commons-line',
  'i-ri-price-tag-3-line',
  'i-ri-link',
  // Sidebar tabs icons
  'i-ri-list-ordered',
  'i-ri-git-branch-line',
  'i-ri-home-2-line',
  // Sidebar quick navigation icons
  'i-ri-arrow-left-s-line',
  'i-ri-arrow-up-line',
  'i-ri-arrow-down-line',
  'i-ri-arrow-right-s-line',
  // Archive page icons
  'i-ri-external-link-line',
]

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
    presetAttributify(),
  ],
  safelist: [...new Set([...iconSafeList, ...commonSidebarIcons])],
})
