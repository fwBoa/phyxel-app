'use client'

import { useEffect, useRef, useState } from 'react'

type Options = {
  threshold?: number
  once?: boolean
}

export function useRevealOnScroll<T extends HTMLElement = HTMLElement>({ threshold = 0.2, once = false }: Options = {}) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return { ref, visible }
}
