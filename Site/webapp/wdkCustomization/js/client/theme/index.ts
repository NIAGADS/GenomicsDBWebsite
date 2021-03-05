import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
    palette: {
        primary: {
            light: "#618eb5",
            main: "#3d5263",
            contrastText: "#f7f6f6",
        },
        secondary: {
            main: "#ffc665",
        },
    },
    typography: {
        fontFamily: [
            "Lato",
            "Roboto",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "-apple-system",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
        //these are mostly default fontsizes, but listing here for reference
        allVariants: {
            color: "#444444",
        },
        caption: {
            fontSize: "14px",
        },
        body2: {
            fontSize: "16px",
        },
        body1: {
            fontSize: "18px",
        },
        h6: {
            fontSize: "20px",
        },
        h5: {
            fontSize: "24px",
        },
        h4: {
            fontSize: "34px",
        },
    },
});
