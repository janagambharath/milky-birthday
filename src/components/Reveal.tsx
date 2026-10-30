import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/confetti'

/** Adds .is-visible when the element scrolls into view. Disabled = always visible. */
export function Reveal({ children, className = '', as: Tag = 'div' }: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'figure'
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true)
            io.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref as never} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </Tag>
  )
}
