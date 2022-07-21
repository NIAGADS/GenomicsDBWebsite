import { createTheme } from '@material-ui/core/styles';
import { themeOptions } from "./theme";

export const theme = createTheme(themeOptions);
export * from "./styles";

export * from "./Tooltips";
export * from "./ElevationScroll";
export * from "./GridElements/DownArrowRow";
export * from "./Drawer";
export * from "./Lists";
export * from "./Panels";
export * from "./InputSlider";

// TODO: Clean-up/Remove
export * from "./Buttons";
export * from "./Inputs";
