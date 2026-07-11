import { useEffect, useRef, useState } from 'react'

export function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(node)
        }
      },
      { threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView } as const
}
