'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type GradientRevealProps = {
  children: ReactNode
  className?: string
}

export default function GradientReveal({ children, className }: GradientRevealProps) {
  const reduce = useReducedMotion()

  return (
    <motion.span
      className={className}
      initial={reduce ? false : { backgroundSize: '0% 100%' }}
      whileInView={{ backgroundSize: '200% 100%' }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  )
}
