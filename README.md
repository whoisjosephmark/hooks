# @josephmark/hooks

A collection of useful React hooks from the team at [Josephmark](https://josephmark.studio)

## Installation

`npm i -S @josephmark/hooks`

## Available Hooks

- [useMouseCoords](#usemousecoords)
- [useDraggable](#usedraggable)
- [useWindowSize](#usewindowsize)
- [WindowSizeContext](#windowsizecontext)
- [useIdList](#useidlist)

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

```jsx
import { useDraggable } from "@josephmark/hooks"

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

### `useWindowSize`
Used for when a SSR and debounced access to the screen size is required.

To allow SSR rendering the default screen size is set to 
```js
{width: 1200, height: 800}
```

The default debounce is 60 times a second (`1000/60`). The debounce delay can be changed by passing a delay prop to the hook.
Setting the delay to 0 will allow the hook to run un-debounced which is useful if you want to use a single hook to provide width and height updates at different tick rates.

```jsx
  import { useWindowSize } from "@josephmark/hooks"

  const DELAY = 1000/60
  
  function WindowSizeComponent () => {
    const { height, width } = useWindowSize(DELAY)

    return <div>
      <p>
        Width: {width}
        <br />
        Heigh: {height}
      </p>
    </div>
  }
```

### `WindowSizeContext`
Scattering `useWindowSize` around a project can lead to performance issues as each instance of `useWindowSize` adds another event handler to `window`. To avoid this we can use the `WindowSizeContext` context.

We first wrap our children in the provider:
```jsx
  import { WindowSizeContext, WindowSizeProvider } from "@josephmark/hooks"

  const DELAY = 1000 / 60

  return <div>
    <WindowSizeProvider delay={DELAY}>
      <WindowSizeComponent />
    </WindowSizeProvider>
  </div>
```
The debounce delay can be changed by passing a delay prop to the WindowSizeProvider.

```jsx
  import { useContext } from "react"
  import { WindowSizeContext } from "@josephmark/hooks"

  function WindowSizeComponent () => {
    const { height, width } = useContext(WindowSizeContext)

    return <div>
      <p>
        Width: {width}
        <br />
        Heigh: {height}
      </p>
    </div>
  }

```
### `useIdList`
```jsx
  import {
    useIdList,
    idListSmallestId,
    idListLargestId,
    idListUnique,
  } from "@josephmark/hooks"

  const baseList = [
    { id: 3, name: "Apple", },
    { id: 1, name: "Pineapple", },
    { id: 4, name: "Rose Apple", },
    { id: 6, name: "Velvet Apple A", },
    { id: 6, name: "Velvet Apple B", },
  ]

  function IdListComponent () {
    const [list, setList, updateId, removeId] = useIdList(baseList)
    // We can update a value at an id by passing in the id and the change
    const fullNameApple = () => updateId({
      id: 3,
      name: "Malus pumila,",
    })
    // We can remove at an id
    const removePineapple = () => removeId({ id: 1 })
    // We can get the smallest id
    const smallestId = () => console.log(idListSmallestId(list))
    // We can get the largest id
    const largestId = () => console.log(idListLargestId(list))
    // We can remove any duplicate id
    const unique = () => setList(idListUnique(list))

    return (
      {list.map((item, index) => {
        return (
          <div key={`${item?.id}${index}`}>
            {item?.id} {item?.name}
          </div>
        )
      })}
    )
  }

```

