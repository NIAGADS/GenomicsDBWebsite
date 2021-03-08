import { useLayoutEffect, useState } from "react";
import { get } from "lodash";

const getWidth = (selector: string) => get(window.document.querySelectorAll(selector), "[0].clientWidth");

export default (selector = "body") => {
    const [width, setWidth] = useState<number>(getWidth(selector));

    useLayoutEffect(() => {
        const resizeListener = () => setWidth(getWidth(selector));
        window.addEventListener("resize", resizeListener);
        return () => window.removeEventListener("resize", resizeListener);
    }, [selector]);

    return width;
};
