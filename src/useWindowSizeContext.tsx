// Libs
import React, { createContext, PropsWithChildren } from "react"

// Comps
import useWindowSize from "./useWindowSize"

interface UseWindowSizeContext {
  width: number
  height: number
}

interface UseWindowSizeContextProps {
  delay?: number
}

export const WindowSizeContext = createContext<UseWindowSizeContext>({
  width: 0,
  height: 0,
})

export const WindowSizeProvider: React.FC<PropsWithChildren<UseWindowSizeContextProps>> = ({
  children, delay,
}) => {
  // Local State
  const sizes = useWindowSize(delay)

  // ..
  return (
    <WindowSizeContext.Provider value={sizes}>
      {children}
    </WindowSizeContext.Provider>
  )
}
