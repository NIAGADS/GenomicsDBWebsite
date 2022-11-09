import { createTheme } from '@material-ui/core/styles';
import { primaryThemeOptions, muiThemeOptions } from "./theme";

export const theme = createTheme(primaryThemeOptions);
export const muiTheme = createTheme(muiThemeOptions);
export * from "./styles";

export * from "./Tooltips";
export * from "./ElevationScroll";
export * from "./GridElements/DownArrowRow";
export * from "./Drawer";
export * from "./Lists";
export * from "./Panels";

// TODO: Clean-up/Remove
export * from "./Buttons";
export * from "./Inputs";
