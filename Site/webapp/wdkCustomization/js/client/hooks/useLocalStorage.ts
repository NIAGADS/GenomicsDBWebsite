// credits to https://usehooks.com/useLocalStorage/
// Sync state to local storage so that it persists through
// a page refresh. Usage is similar to useState except
// we pass in a local storage key so that we can default to that value on 
// page load instead of the specified initial value.

import { useCallback, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useLocalStorage(key: string, initialValue: any) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: any) => {
      try {
        // Save state
        setStoredValue(value)
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error)
      }
    },
    [key]
  )

  return [storedValue, setValue]
}
