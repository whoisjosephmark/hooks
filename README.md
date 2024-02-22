# @josephmark/hooks

[![Run Tests](https://github.com/whoisjosephmark/hooks/actions/workflows/test.yml/badge.svg)](https://github.com/whoisjosephmark/hooks/actions/workflows/test.yml)

A collection of useful React hooks from the team at [Josephmark](https://josephmark.studio)

## Installation

`npm i -S @josephmark/hooks`

## Available Hooks

- [useMouseCoords](#usemousecoords)
- [useDraggable](#usedraggable)
- [useScreenEntry](#usescreenentry)

## Usage

### `useMouseCoords`

```jsx
import { useMouseCoords } from "@josephmark/hooks"

function ComponentWithCoords() {
  const [left, top] = useMouseCoords()

  return (
    <div style={{ left, top, position: "fixed" }}>
      This element follows the mouse
    </div>
  )
}
```

### `useDraggable`

Gives drag-to-scroll features on a container element for touch-like interactions with a mouse.

```jsx
import { useDraggable } from "@josephmark/hooks"

function DraggableComponent() {
  // Options argument is not required, these are the default values
  const ref = useDraggable({ autoCursor: true, dragClickAllowance: 10 })

  return (
    <div style={{ display: "flex", overflow: "auto", gap: "1rem" }} ref={ref}>
      {Array(25)
        .fill("")
        .map((_, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: 150,
              height: 150,
              background: "lavender",
            }}
          />
        ))}
    </div>
  )
}
```

### `useScreenEntry`

```jsx
import { useScreenEntry } from "@josephmark/hooks"

function ComponentWithScreenEntry() {
  const { ref, onScreen } = useScreenEntry()

  return (
    <div
      ref={ref}
      style={{ opacity: onScreen ? 1 : 0, transition: "opacity 300ms" }}
    >
      This element will be revealed when it enters the screen
    </div>
  )
}
```
