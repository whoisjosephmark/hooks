// Libs
import React, { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

// 60 times in a second
const DEFAULT_DELAY = 1000 / 60

function useWindowSize(delay?: number) {
  // Props
  const theDelay: number = (!delay && delay !== 0) ? DEFAULT_DELAY : delay

  // Local State
  const [windowSize, setWindowSize] = useState({
    width: 1200,
    height: 800,
  })

  // Func
  const changeWindowSize = useDebouncedCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }, theDelay)

  // When comp is not SSR then set values
  useEffect(() => {
    changeWindowSize()
  }, [])

  React.useEffect(() => {
    window.addEventListener("resize", changeWindowSize)

    return () => {
      window.removeEventListener("resize", changeWindowSize)
    }
  }, [])

  return windowSize
}

export default useWindowSize
