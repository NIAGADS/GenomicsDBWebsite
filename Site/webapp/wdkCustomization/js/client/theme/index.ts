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
    },
});
