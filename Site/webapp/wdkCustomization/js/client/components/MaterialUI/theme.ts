import { ThemeOptions, makeStyles, Theme, createStyles } from "@material-ui/core/styles";

// MUI default theme, for theming blue buttons and the like
export const muiThemeOptions: ThemeOptions = {
  palette: {type: "light"}
}

export const primaryThemeOptions: ThemeOptions = {
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
       // color: 'transparent'
      },
      MuiTablePagination: {
        labelRowsPerPage: 'Results per page:'
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
      h4: {
        fontFamily: '"Libre Franklin", "Raleway", "Roboto", "Arial", "sans-serif"'
      },
      h5: {
        fontFamily: '"Roboto", "Arial", "sans-serif"'
      },
      h6: {
        fontFamily: '"Roboto", "Arial", "sans-serif"',
        fontSize: "1rem"
      },
      body2: {
          //fontSize: "1.5rem",
          fontFamily: '"Roboto", "Arial", "sans-serif"'  
      },
      body1: {
        // fontSize: "1.2rem",
        fontFamily: '"Roboto", "Arial", "sans-serif"'
      }
    }
  };

