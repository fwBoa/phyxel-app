import React from 'react'

const MOTION_PROPS = new Set([
  'initial','animate','exit','transition','variants',
  'whileHover','whileTap','whileFocus','whileInView',
  'layoutId','layout','drag','dragConstraints',
  'onAnimationStart','onAnimationComplete',
])

function createMotionComponent(tag: string) {
  return React.forwardRef(
    ({ children, ...props }: React.HTMLAttributes<HTMLElement> & Record<string, unknown>, ref: React.Ref<HTMLElement>) => {
      const domProps = Object.fromEntries(
        Object.entries(props).filter(([k]) => !MOTION_PROPS.has(k))
      )
      return React.createElement(tag, { ...domProps, ref }, children)
    }
  )
}

export const motion = new Proxy({} as Record<string, ReturnType<typeof createMotionComponent>>, {
  get: (_, tag: string) => createMotionComponent(tag),
})

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>

export const useScroll = jest.fn(() => ({
  scrollY:         { get: jest.fn(() => 0), onChange: jest.fn(() => () => {}) },
  scrollYProgress: { get: jest.fn(() => 0), onChange: jest.fn(() => () => {}) },
}))
export const useMotionValueEvent = jest.fn()
export const useMotionValue      = jest.fn((initial: number) => ({
  get:      jest.fn(() => initial),
  set:      jest.fn(),
  onChange: jest.fn(() => () => {}),
}))
export const useTransform = jest.fn((mv: unknown) => mv)
export const useInView    = jest.fn(() => false)

export default { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue, useTransform, useInView }
