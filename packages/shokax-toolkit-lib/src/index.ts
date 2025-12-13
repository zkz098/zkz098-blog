/* v8 ignore next 100 */

import { calculatePostStats, calculateTotalWords, formatReadingTime } from './posts/calculateStats'
import { formatCategories } from './posts/formatCategories'
import { generateTagCloud } from './posts/generateTagCloud'
import { getRandomItems, shuffleArray } from './posts/randomPosts'
import { structurePostsByDate } from './posts/structurePostsByDate'
import { fmtNum } from './tools/fmtNum'
import { generateRandomBrightColor } from './tools/generateRandomBrightColor'

// Named exports
export {
  calculatePostStats,
  calculateTotalWords,
  fmtNum,
  formatCategories,
  formatReadingTime,
  generateRandomBrightColor,
  generateTagCloud,
  getRandomItems,
  shuffleArray,
  structurePostsByDate,
}

// Re-export types
export type { Category, Post } from './posts/types'

export default {
  formatCategories,
  structurePostsByDate,
  generateTagCloud,
  calculatePostStats,
  calculateTotalWords,
  formatReadingTime,
  getRandomItems,
  shuffleArray,
  generateRandomBrightColor,
  fmtNum,
}
