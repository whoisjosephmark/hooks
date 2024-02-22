import { useState, useEffect, useRef, useCallback } from "react"

/**
 * Fetch current mouse coordinates
 *
 * @returns [x: number, y: number]
 */
export default function useMouseCoords() {
  const [coords, setCoords] = useState<[number, number]>([0, 0])
  const awaitingIdle = useRef(false)

  const mouseFollower = useCallback((e: MouseEvent) => {
    awaitingIdle.current = false
    setCoords([e.clientX, e.clientY])
  }, [])

  const mouseFollowerCaller = useCallback(
    (e: MouseEvent) => {
      if (awaitingIdle.current) {
        return
      }
      requestAnimationFrame(() => mouseFollower(e))
    },
    [mouseFollower]
  )

  useEffect(() => {
    if (typeof window === "undefined") {
      return () => {}
    }
    document.addEventListener("mousemove", mouseFollowerCaller)
    return () => {
      document.removeEventListener("mousemove", mouseFollowerCaller)
    }
  }, [mouseFollowerCaller])

  return coords
}
