"use client"

import React, { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 1800,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true

          let startTime: number | null = null

          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            // Easing function: easeOutExpo
            const easeOutProgress =
              progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

            const currentVal = Math.round(easeOutProgress * value)
            setCount(currentVal)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(value)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={elementRef} className={`tabular-nums ${className}`}>
      {prefix}
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  )
}
