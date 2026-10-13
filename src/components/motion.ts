/** Shared animation language: one easing curve, consistent durations and offsets. */
export const ease = [0.22, 1, 0.36, 1] as const

export const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  },
  item: {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  },
}

export const inView = { once: true, margin: '0px 0px -12% 0px' } as const
