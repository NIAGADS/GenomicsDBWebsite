import { ThemeOptions, makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const themeOptions: ThemeOptions = {
    palette: {
      type: 'light',
      primary: {
        main: '#27333f',
      },
      secondary: {
        main: '#ffc665',
      },
    },
    props: {
      MuiAppBar: {
        color: 'transparent',
      }
    },
    typography: {
      h1: {
        fontFamily: '"Libre Franklin", "Raleway", "Roboto", "Arial", "sans-serif"'
      },
      h2: {
        fontFamily: '"Libre Franklin", "Raleway", "Roboto", "Arial", "sans-serif"'
      },
      h3: {
        fontFamily: '"Libre Franklin", "Raleway", "Roboto", "Arial", "sans-serif"'
      },
      body2: {
          fontSize: "1.25rem",
          fontFamily: '"Raleway", "Roboto", "Arial", "sans-serif"'
      }
    }
  };
