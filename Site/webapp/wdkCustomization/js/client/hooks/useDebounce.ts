// credit to https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
// and https://github.com/ggascoigne/react-table-example

// This hook allows you to debounce any fast changing value. The debounced 
// value will only reflect the latest value when the useDebounce hook has 
// not been called for the specified time period. When used in conjunction 
// with useEffect, as we do in the recipe below, you can easily ensure that 
// expensive operations like API calls are not executed too frequently.
// description from https://usehooks.com/useDebounce/

import { useEffect, useState } from "react";

// Our hook
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useDebounce(value: any, delay: number): any {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            // Set debouncedValue to value (passed in) after the specified delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            // Return a cleanup function that will be called every time ...
            // ... useEffect is re-called. useEffect will only be re-called ...
            // ... if value changes (see the inputs array below).
            // This is how we prevent debouncedValue from changing if value is ...
            // ... changed within the delay period. Timeout gets cleared and restarted.
            // To put it in context, if the user is typing within our app's ...
            // ... search box, we don't want the debouncedValue to update until ...
            // ... they've stopped typing for more than 500ms.
            return () => {
                clearTimeout(handler);
            };
        },
        // Only re-call effect if value changes
        // You could also add the "delay" var to inputs array if you ...
        // ... need to be able to change that dynamically.
        [value, delay]
    );

    return debouncedValue;
}
