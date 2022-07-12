import { useState, useEffect } from "react"

/**
 * Fetch current mouse coordinates
 *
 * @returns [number, number]
 */
export default function useMouseCoords() {
  const [coords, setCoords] = useState([0, 0])
  useEffect(() => {
    if (typeof window === "undefined") {
      return () => {}
    }
    let awaitingIdle = false
    const mouseFollower = (e: MouseEvent) => {
      awaitingIdle = false
      setCoords([e.clientX, e.clientY])
    }
    const mouseFollowerCaller = (e: MouseEvent) => {
      if (awaitingIdle) {
        return
      }
      awaitingIdle = true
      requestAnimationFrame(() => mouseFollower(e))
    }
    document.addEventListener("mousemove", mouseFollowerCaller)
    return () => {
      window.removeEventListener("mousemove", mouseFollowerCaller)
    }
  }, [])

  return coords
}
