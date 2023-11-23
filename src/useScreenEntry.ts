import { useEffect, useRef, useState } from "react"

/* global IntersectionObserverInit */
/**
 * Detects when an element is on screen.
 *
 * @param {IntersectionObserverInit} observerOptions
 * @param {T extends HTMLElement} defaultRef
 *
 * @returns {onScreen: boolean, ref: React.RefObject<T extends HTMLElement>}
 */
export default function useScreenEntry<T extends HTMLElement = HTMLDivElement>(
  observerOptions: IntersectionObserverInit = {
    rootMargin: "0px 0px 0px 0px",
  },
  defaultRef: T | null = null
) {
  const [onScreen, setOnScreen] = useState(false)

  const ref = useRef<T>(defaultRef)

  useEffect(() => {
    if (!ref?.current) {
      return () => {}
    }

    const visibleObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return
        }

        setOnScreen(entry.isIntersecting)
      },
      { rootMargin: "-3%" }
    )

    visibleObserver.observe(ref.current)
    return () => {
      visibleObserver.disconnect()
    }
  }, [observerOptions])

  return { onScreen, ref }
}
