export type Anchor = 'top' | 'left' | 'bottom' | 'right';

export interface DrawerProps {
    navigation?: React.ReactNode;
    drawerContents?: React.ReactNode;
    drawerProps?: any;
    navigationProps?: any; //appBarProps
    toggleAnchor?: Anchor;
    toggleIcon?: React.ReactNode;
    toggleHelp?: string;
    drawerCloseLabel?: string;
    drawerHeaderContents?: React.ReactNode;
    handleClose?: any;
    handleOpen?: any;
    title?: string;
}

export interface DrawerContentsProps {
    children?: React.ReactNode; // what goes in the div (e.g., a table)
}

export * from "./NavigationDrawer"
export * from "./PersistentDrawerLeft";
export * from "./EncapsulatedDrawer";