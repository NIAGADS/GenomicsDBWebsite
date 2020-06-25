import { useEffect } from "react";

export default <T extends HTMLElement>(containerRef: React.MutableRefObject<T>, onAwayClick: () => void) => {
    return useEffect(() => {
        const listener = (e: Event) => {
            if (!containerRef.current.contains(e.target as Node)) {
                onAwayClick();
            }
        };
        window.document.addEventListener("click", listener);
        return () => window.document.removeEventListener("onclick", listener);
    }, [containerRef, onAwayClick]);
};
