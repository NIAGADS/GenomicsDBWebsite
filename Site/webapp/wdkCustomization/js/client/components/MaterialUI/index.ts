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
};

export const theme = createMuiTheme(themeOptions);
export * from "./Autocomplete";
export * from "./Buttons";
export * from "./Inputs";
export * from "./Links";
export * from "./Lists";
export * from "./Typography";
