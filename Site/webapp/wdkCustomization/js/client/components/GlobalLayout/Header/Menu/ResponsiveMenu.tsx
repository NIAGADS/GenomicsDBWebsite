import React, { useEffect, useRef, useState } from "react";
import { MenuItem } from "../../../../data/mainMenuItems";
import { Link } from "wdk-client/Components";
import { useClickAway } from "./../../../../hooks";

interface BaseMenu {
    webAppUrl: string;
    projectId: string;
    showLoginWarning: boolean;
    isGuest: boolean;
}

interface RespMenuItem extends BaseMenu {
    item: MenuItem;
}

interface Menu extends BaseMenu {
    items: MenuItem[];
    responsiveMenuToggled: boolean;
}

const Menu: React.FC<Menu> = ({ webAppUrl, projectId, showLoginWarning, isGuest, items, responsiveMenuToggled }) => {
    const widthRef = useRef<number>();

    useEffect(() => {
        widthRef.current = window.innerWidth;
    }, []);

    return (
        <div className="site-menu">
            <nav>
                {(widthRef.current > 767 || responsiveMenuToggled) && (
                    <ul>
                        {items.map((item: MenuItem, index: number) => {
                            return (
                                <NavDropdownItem
                                    item={item}
                                    webAppUrl={webAppUrl}
                                    isGuest={isGuest}
                                    showLoginWarning={showLoginWarning}
                                    projectId={projectId}
                                    key={index}
                                >
                                    {item.children &&
                                        item.children.map((child: MenuItem) => (
                                            <MenuItem
                                                key={child.id}
                                                item={child}
                                                webAppUrl={webAppUrl + child.webAppUrl}
                                                isGuest={isGuest}
                                                showLoginWarning={showLoginWarning}
                                                projectId={projectId}
                                            />
                                        ))}
                                </NavDropdownItem>
                            );
                        })}
                    </ul>
                )}
            </nav>
        </div>
    );
};

export default Menu;

interface Hamburger {
    onToggle: () => void;
}

export const HamburgerMenu: React.SFC<Hamburger> = ({ onToggle }) => {
    return (
        <a className="hamburger" onClick={onToggle}>
            <i className="fa fa-2x fa-bars" />
        </a>
    );
};

const NavDropdownItem: React.FC<RespMenuItem> = (props) =>
    props.children ? <DropdownParent {...props} /> : <MenuItem {...props} />;

const DropdownParent: React.FC<RespMenuItem> = ({ children, item }) => {
    const [childrenVisible, setChildrenVisible] = useState(false),
        dropdownClass = !children ? "" : childrenVisible ? "up" : "down",
        containerRef = useRef<any>();

    useClickAway(containerRef, () => setChildrenVisible(false));
    return (
        <li ref={containerRef} onClick={() => setChildrenVisible(!childrenVisible)}>
            <a href="#" className="nav-item">
                {item.text}
                &nbsp;
                <i className={`fa fa-chevron-${dropdownClass}`} />
            </a>
            <ul className="dropdown-list">{childrenVisible && children}</ul>
        </li>
    );
};
const MenuItem: React.SFC<RespMenuItem> = ({ item, webAppUrl }) => (
    <li>
        {item.webAppUrl ? (
            <a title={item.tooltip} href={webAppUrl}>
                {item.text}&nbsp;{item.id == "home" && <i className="fa fa-home" />}
            </a>
        ) : item.route ? (
            <Link to={item.route}>
                {item.text}&nbsp;{item.id == "home" && <i className="fa fa-home" />}
            </Link>
        ) : null}
    </li>
);
