'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type StaggerContainerProps = {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
  amount?: number
}

export default function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = false,
  amount = 0.1,
}: StaggerContainerProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  y = 40,
  duration = 0.7,
}: {
  children: ReactNode
  className?: string
  y?: number
  duration?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? {} : { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
