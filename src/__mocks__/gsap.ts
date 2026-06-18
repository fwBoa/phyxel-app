const tween = { kill: jest.fn() }
const timeline = {
  to:      jest.fn().mockReturnThis(),
  from:    jest.fn().mockReturnThis(),
  fromTo:  jest.fn().mockReturnThis(),
  kill:    jest.fn(),
  pause:   jest.fn(),
  play:    jest.fn(),
}

const gsap = {
  to:             jest.fn(() => tween),
  from:           jest.fn(() => tween),
  fromTo:         jest.fn(() => tween),
  set:            jest.fn(),
  timeline:       jest.fn(() => timeline),
  registerPlugin: jest.fn(),
  context:        jest.fn(() => ({ revert: jest.fn(), add: jest.fn() })),
  matchMedia:     jest.fn(() => ({ add: jest.fn(), revert: jest.fn() })),
  ticker:         { add: jest.fn(), remove: jest.fn() },
  utils:          { toArray: jest.fn((v: unknown) => (Array.isArray(v) ? v : [])) },
}

export default gsap
export const { to, from, fromTo, set, registerPlugin, context } = gsap
export const useGSAP = jest.fn((fn: () => void) => { fn() })
