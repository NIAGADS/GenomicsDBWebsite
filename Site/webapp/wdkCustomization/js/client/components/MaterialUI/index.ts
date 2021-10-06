import { ThemeOptions, createMuiTheme } from '@material-ui/core/styles';


const themeOptions: ThemeOptions = {
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
      fontFamily: '"Libre Franklin", "Raleway", "Arial", "sans-serif"'
    },
    h2: {
      fontFamily: '"Libre Franklin", "Raleway", "Arial", "sans-serif"'
    },
    h3: {
      fontFamily: '"Libre Franklin", "Raleway", "Arial", "sans-serif"'
    },
  }
};

export const theme = createMuiTheme(themeOptions);
export * from "./Buttons";
export * from "./Inputs";
export * from "./Links";
export * from "./Lists";
export * from "./Typography";
export * from "./ElevationScroll";