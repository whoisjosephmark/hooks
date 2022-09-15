// Libs
import { useState } from "react"

// Types 
export type JsonId = {
  id?: number
}

export type JsonIdMap<T> = {
  [key: number]: JsonId & T
}

type UseIdList = <T>(initialState: (T & JsonId)[]) => [
  (T & JsonId)[],
  (items: (T & JsonId)[]) => (T & JsonId)[],
  (item: (T & JsonId)) => (T & JsonId)[],
  (item: (T & JsonId)) => (T & JsonId)[],
]

const useIdList: UseIdList = <T>(initialState: (T & JsonId)[] | null) => {

  // Local State
  const [state, setState] = useState<(T & JsonId)[]>(initialState || [])

  // Update all values
  function updateAll(items: (T & JsonId)[]) {
    setState(items)
    return items
  }

  // Update at a certain Id
  function updateId(item: (T & JsonId)) {
    const newState = state?.map((existing) => {
      return (item?.id === existing?.id)
        ? {
          ...existing,
          ...item
        } : existing
    })
    setState([...newState])
    return newState
  }

  // Remove at a certain Id
  function removeId(item: (T & JsonId)) {
    const newState = state?.filter((existing: (T & JsonId)) => {
      return (existing?.id !== item?.id) ? true : false
    })
    setState(newState)
    return newState
  }

  // TODO: update multiple values

  // .. []
  return [state, updateAll, updateId, removeId]
}

export default useIdList

// Order by ID big to small
export function idListById<T>(items: (T & JsonId)[]) {
  return items.sort((a: (T & JsonId), b: (T & JsonId)) => a?.id || 0 - (b?.id || -1) || 0);
}

// Order By the Id's
export function idListLargestId<T>(items: (T & JsonId)[]) {
  return items?.reduce((currentLargest, item) => {
    if ((item?.id || -1) > currentLargest) {
      return item?.id
    }
    return currentLargest
  }, 0) || 0
}

// Order by the smallest id
export function idListSmallestId<T>(items: (T & JsonId)[]) {
  return items?.reduce((currentLargest, item) => {
    if ((item?.id || -1) < currentLargest || currentLargest === 0) {
      return item?.id
    }
    return currentLargest
  }, 0) || 0
}

// Convert list to a map
// Note number Ids will be ascending ordered
export function idListAsMap<T>(items: (T & JsonId)[]) {
  const asObjectMap = items.reduce((allValues, item) => {
    return {
      ...allValues,
      [item?.id || -1]: item,
    }
  }, {} as JsonIdMap<T>)
  return asObjectMap as JsonIdMap<T>
}

// Convert a map to a list
// Note number Ids will be ascending ordered
export function idMapAsList<T>(mapItems: JsonIdMap<T>) {
  const asList: (T & JsonId)[] = Object.keys(mapItems).reduce((allValues, itemKey) => {
    return [
      ...allValues,
      mapItems[itemKey]
    ]
  }, [] as (T & JsonId)[])
  return asList
}

// Remove any ID duplicates
// - the newest result added to the array will be retained
export function idListUnique<T>(items: (T & JsonId)[]) {
  const uniqueIds: number[] = []

  // We have to reverse twice to keep the oldest values
  const unique = items.reverse().filter(item => {
    // Has the id been seen before
    const isDuplicate = uniqueIds.includes(item?.id || -1)
    // Is the Id valid
    if (!isDuplicate && (item?.id || -1) > 0) {
      uniqueIds.push(item.id || -1)
      return true
    }
    // Fail through if found already
    return false
  }).reverse()

  return unique
}
