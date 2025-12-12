<script lang='ts'>
  import { onMount } from 'svelte'

  interface PostMeta {
    date: Date
    wordCount: number
    readTime: number
  }

  const {
    title = '',
    subtitle = '',
    logo = '',
    pageTitle = '',
    postMeta,
  }: {
    title?: string
    subtitle?: string
    logo?: string
    pageTitle?: string
    postMeta?: PostMeta
  } = $props()

  // Use pageTitle if provided (for non-index pages), otherwise use title from config
  const displayTitle = $derived(pageTitle || title)
  // Only show subtitle on index page (when no pageTitle) and no postMeta
  const shouldShowSubtitle = $derived(!pageTitle && !postMeta && subtitle)
  // Show postMeta for post pages
  const shouldShowPostMeta = $derived(!!postMeta)

  function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function formatWordCount(count: number): string {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return String(count)
  }

  let isAffix = $state(false)

  onMount(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return

    const handleScroll = () => {
      // 当页面向下滚动时，添加 affix 类
      isAffix = window.scrollY > 0
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  })
</script>

<div
  id='brand'
  class={`fixed w-full px-20 pt-12 text-center h-[50vh] min-h-40 flex flex-col items-center justify-center ${isAffix ? 'affix' : ''}`.trim()}
>
  <div class='pjax flex flex-col w-full items-center justify-center'>
    {#if logo}
      <div class='artboard text-6xl leading-1.2 font-bold mb-2.5'>
        {logo}
      </div>
    {/if}

    {#if displayTitle}
      <h1 class='letter-space-2 text-5xl leading-tight tracking-wider font-600'>
        {displayTitle}
      </h1>
    {/if}

    {#if shouldShowSubtitle}
      <p class='text-2xl m-0 mt-2.5 flex gap-2.5'>
        <span class='flex items-center'>=</span>
        <span>{subtitle}</span>
        <span class='flex items-center'>=</span>
      </p>
    {/if}

    {#if shouldShowPostMeta && postMeta}
      <div class='meta text-base mt-2.5 flex flex-wrap gap-3 justify-center items-center opacity-80'>
        <span class='item flex items-center gap-1' title='发表于 {formatDate(postMeta.date)}'>
          <i class='i-ri-calendar-line'></i>
          <span class='text'>发表于</span>
          <time datetime={postMeta.date.toISOString()}>{formatDate(postMeta.date)}</time>
        </span>
        <span class='item flex items-center gap-1' title='本文字数'>
          <i class='i-ri-quill-pen-line'></i>
          <span class='text'>本文字数</span>
          <span>{formatWordCount(postMeta.wordCount)}字</span>
        </span>
        <span class='item flex items-center gap-1' title='阅读时长'>
          <i class='i-ri-time-line'></i>
          <span class='text'>阅读时长</span>
          <span>{postMeta.readTime} 分钟</span>
        </span>
      </div>
    {/if}
  </div>
</div>

<style>
  #brand {
    z-index: auto;
    transition: all 0.3s ease;
  }

  #brand.affix {
    z-index: 0;
  }

  .pjax {
    animation: slideDownIn 0.6s ease-out;
    /* 防止动画导致CLS，预留初始空间 */
    min-height: 1px;
  }

  @keyframes slideDownIn {
    from {
      opacity: 0;
      transform: translateY(-2rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    #brand {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      padding-top: 3rem;
    }

    :global(h1) {
      font-size: 1.875rem;
    }
  }

  @media (max-width: 480px) {
    #brand .artboard {
      font-size: 2rem;
    }
  }
</style>
