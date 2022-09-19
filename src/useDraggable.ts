import { useRef, useEffect, MouseEvent } from "react"

const DRAG_CLICK_ALLOWANCE = 10

/**
 * Allows mouse users to easily click+drag to scroll (horizontal only).
 * Plays nice with scroll-snap carousels.
 * Apply the returned ref to the element you want to be draggable.
 *
 * @return React.RefObject<HTMLDivElement>
 */
export default function useDraggable() {
  const ref = useRef<HTMLDivElement>(null)

  // Handling for click & drag to slide with mouse
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)")
    if (mq.matches || !ref.current) {
      return () => { }
    }
    let mouseInitialX: number | null = null
    let trackInitialX: number | null = null
    let target: EventTarget
    const track = ref.current
    track.style.cursor = "grab"

    const cancelClick = function (this: any, e: MouseEvent) {
      if (
        mouseInitialX &&
        Math.abs(e.clientX - mouseInitialX) > DRAG_CLICK_ALLOWANCE
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
      mouseInitialX = null
      trackInitialX = null
      e.target.removeEventListener("click", this)
    }

    const onDrag = (e: MouseEvent) => {
      track.scrollTo((trackInitialX || 0) - e.clientX + (mouseInitialX || 0), 0)
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const onMouseUp = function (this: any) {
      track.style.scrollBehavior = "" // null
      track.style.cursor = "grab"
      requestAnimationFrame(() => {
        track.style.scrollSnapType = "" // null
      })
      window.removeEventListener("mousemove", onDrag as any)
      window.removeEventListener("mouseup", this)
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) {
        return
      }
      track.style.cursor = "grabbing"
      mouseInitialX = e.clientX
      trackInitialX = track.scrollLeft
      track.style.scrollBehavior = "auto"
      track.style.scrollSnapType = "none"
      window.addEventListener("mousemove", onDrag as any)
      window.addEventListener("mouseup", onMouseUp)
      target = e.target
      target.addEventListener("click", cancelClick as any)
    }
    track.addEventListener("mousedown", onMouseDown as any)

    return () => {
      track.removeEventListener("mousedown", onMouseDown as any)
      window.removeEventListener("mouseup", onMouseUp)
      if (!target) {
        return
      }
      target.removeEventListener("click", cancelClick as any)
    }
  }, [])

  return ref
}