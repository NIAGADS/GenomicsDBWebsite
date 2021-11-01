import { boolean } from "wdk-client/Utils/Json";

export * from "./HomePage/HomePage";
export * from "./Header/Header";
export * from "./CustomPageLayout";

export interface DrawerState {
    drawerIsOpen: boolean;
    handleDrawerClose: any;
}