import { useState } from 'react'
import localPortraits from '../data/local-portraits.json'

type PortraitImageProps = {
  /** Set folder under public/images/ — e.g. presidents, monarchs */
  folder: 'presidents' | 'monarchs'
  id: string
  remote: string
  className: string
  alt?: string
}

function thumbFallback(url: string): string | null {
  if (!url.includes('/thumb/')) return null
  if (/\/\d+px-/.test(url)) {
    return url.replace(/\/\d+px-/, '/330px-')
  }
  return null
}

function withBase(path: string): string {
  const base = import.meta.env.BASE_URL
  if (/^https?:\/\//.test(path)) return path
  return `${base}${path.replace(/^\//, '')}`
}

/**
 * Portrait loader with optional local overrides.
 *
 * To use a local file:
 * 1. Drop `public/images/{folder}/{id}.jpg` (or .png / .webp)
 * 2. Add `{id}` to `src/data/local-portraits.json` under that folder
 *
 * Or set the card's JSON `image` to `images/presidents/{id}.jpg` directly.
 */
export function PortraitImage({
  folder,
  id,
  remote,
  className,
  alt = '',
}: PortraitImageProps) {
  const base = import.meta.env.BASE_URL
  const preferLocal = (
    localPortraits[folder] as string[] | undefined
  )?.includes(id)

  const localPaths = [
    `${base}images/${folder}/${id}.jpg`,
    `${base}images/${folder}/${id}.png`,
    `${base}images/${folder}/${id}.webp`,
  ]

  const [candidates] = useState(() => {
    const list: string[] = []
    const push = (url: string | null | undefined) => {
      if (url && !list.includes(url)) list.push(url)
    }

    if (preferLocal) {
      localPaths.forEach(push)
    }

    if (remote) push(withBase(remote))
    push(thumbFallback(remote))

    if (!preferLocal) {
      localPaths.forEach(push)
    }

    return list
  })

  const [srcIndex, setSrcIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const src = candidates[srcIndex]

  if (failed || !src) {
    return <div className={`${className} is-empty`}>No portrait</div>
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => {
        const next = srcIndex + 1
        if (next < candidates.length) setSrcIndex(next)
        else setFailed(true)
      }}
    />
  )
}
