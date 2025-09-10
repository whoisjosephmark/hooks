import { useEffect, useRef } from "react"

const DRAG_CLICK_ALLOWANCE = 10

export type useDraggableOptions = {
  autoCursor?: boolean
  dragClickAllowance?: number
}

/**
 * Allows mouse users to easily click+drag to scroll (horizontal only).
 * Plays nice with scroll-snap carousels.
 * Apply the returned ref to the element you want to be draggable.
 *
 * @param options - Options for the draggable
 * @param {boolean} options.autoCursor - Whether to automatically change the cursor to "grab" and "grabbing" on drag
 * @param {number} options.dragClickAllowance - The number of pixels the mouse can move while dragging and still generate a click event
 *
 * @return React.RefObject<T extends HTMLElement>
 */
export default function useDraggable<T extends HTMLElement = HTMLDivElement>(options?: useDraggableOptions) {
  const ref = useRef<T>()
  const { autoCursor = true, dragClickAllowance = DRAG_CLICK_ALLOWANCE } = options || {}

  // Handling for click & drag to slide with mouse
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)")
    if (mq.matches || !ref.current) {
      return () => {}
    }
    let mouseInitialX: number | null = null
    let trackInitialX: number | null = null
    let target: EventTarget | null
    const track = ref.current
    if (autoCursor) {
      track.style.cursor = "grab"
    }

    // Prevent native element dragging (e.g., <a>, <img>) while we are doing a scroll-drag
    function preventNativeDrag(e: DragEvent) {
      e.preventDefault()
    }

    function cancelClick(e: MouseEvent) {
      if (mouseInitialX && Math.abs(e.clientX - mouseInitialX) > dragClickAllowance) {
        e.preventDefault()
        e.stopPropagation()
      }
      mouseInitialX = null
      trackInitialX = null
      e?.target?.removeEventListener("click", cancelClick)
    }

    function onDrag(e: MouseEvent) {
      track.scrollTo((trackInitialX || 0) - e.clientX + (mouseInitialX || 0), 0)
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    function onMouseUp() {
      track.style.scrollBehavior = ""
      if (autoCursor) {
        track.style.cursor = "grab"
      }
      track.style.userSelect = ""
      requestAnimationFrame(() => {
        track.style.scrollSnapType = ""
      })
      window.removeEventListener("mousemove", onDrag)
      window.removeEventListener("mouseup", onMouseUp)
      // stop intercepting native drag events
      track.removeEventListener("dragstart", preventNativeDrag, true)
    }

    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) {
        return
      }
      if (autoCursor) {
        track.style.cursor = "grabbing"
      }
      mouseInitialX = e.clientX
      trackInitialX = track.scrollLeft
      track.style.scrollBehavior = "auto"
      track.style.scrollSnapType = "none"
      track.style.userSelect = "none" // avoid text selection while dragging
      // Intercept native drag events on links/images while dragging
      track.addEventListener("dragstart", preventNativeDrag, true)
      window.addEventListener("mousemove", onDrag)
      window.addEventListener("mouseup", onMouseUp)
      target = e.target
      target?.addEventListener("click", cancelClick)
    }
    track.addEventListener("mousedown", onMouseDown)

    return () => {
      track.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
      if (!target) {
        return
      }
      target.removeEventListener("click", cancelClick)
    }
  }, [autoCursor, dragClickAllowance])

  return ref
}
