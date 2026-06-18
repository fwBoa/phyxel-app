'use client'

import { useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'

export function useScrollDirection() {
  const [direction, setDirection] = useState<'down' | 'up'>('down')
  const lastY = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setDirection(y > lastY.current ? 'down' : 'up')
    lastY.current = y
  })

  return direction
}
