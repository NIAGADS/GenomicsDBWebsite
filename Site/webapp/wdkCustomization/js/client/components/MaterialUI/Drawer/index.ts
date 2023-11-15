export type Anchor = 'top' | 'left' | 'bottom' | 'right';

export interface DrawerProps {
    navigation?: React.ReactNode;
    drawerContents?: React.ReactNode;
    drawerSections?: React.ReactNode[];
    drawerProps?: any;
    navigationProps?: any; //appBarProps
    toggleAnchor?: Anchor;
    toggleIcon?: React.ReactNode;
    toggleHelp?: string;
    toggleText?: string;
    drawerCloseLabel?: string;
    drawerHeaderContents?: React.ReactNode;
    handleClose?: any;
    handleOpen?: any;
    title?: string;
    className?: string;
    width?: any;
    encapsulated?: boolean;
}

export interface DrawerContentsProps {
    children?: React.ReactNode; // what goes in the div (e.g., a table)
}


export const DRAWER_WIDTH = 300;
export const SHIFT_X = 250;
export interface DrawerState {
    isOpen: boolean;
    handleClose?: any;
    handleOpen?: any;
}


export * from "./NavigationDrawer"
export * from "./EncapsulatedDrawer";