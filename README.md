# @josephmark/hooks

A collection of useful React hooks from the team at [Josephmark](https://josephmark.studio)

## Installation

`npm i -S @josephmark/hooks`

## Available Hooks

- [useMouseCoords](#usemousecoords)
- [useDraggable](#usedraggable)

## Usage

### `useMouseCoords`

```jsx
import useMouseCoords from "@josephmark/hooks/useMouseCoords"

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

```jsx
import useDraggable from "@josephmark/hooks/useDraggable"

function DraggableComponent() {
  const ref = useDraggable()

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
