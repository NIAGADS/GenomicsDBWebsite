import React from "react";
import { isEmpty } from "lodash";
import { MenuItem } from "../../../../data/mainMenuItems";
import { Link } from "wdk-client/Components";

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

interface MenuState {
    responsiveMenuToggled: boolean;
    width?: number;
}

const Menu: React.ComponentClass<Menu, MenuState> = class extends React.Component<Menu, MenuState> {
    private dropdownOpen: string;

    constructor(props: Menu) {
        super(props);
        this.state = { responsiveMenuToggled: false };
    }

    componentWillMount = () => this.getWidth();

    componentDidMount = () => window.addEventListener("resize", this.updateWidth);

    componentWillUnmount = () => window.removeEventListener("resize", this.updateWidth);

    sendClosedSignal = (id: string) => {
        this.dropdownOpen = id;
    };

    getWidth = () => this.setState({ width: window.innerWidth });

    updateWidth = (e: any) => this.setState({ width: e.currentTarget.innerWidth });

    render = () => (
        <div className="site-menu">
            <nav>
                {(this.state.width > 767 || this.props.responsiveMenuToggled) && (
                    <ul>
                        {this.props.items.map((item: any, index: any) => {
                            return !isEmpty(item.children) ? (
                                <NavDropdown
                                    title={item.text}
                                    id={item.id}
                                    key={index}
                                    onOpen={this.sendClosedSignal}
                                    opening={this.dropdownOpen}
                                >
                                    {item.children.map((child: MenuItem) => (
                                        <MenuItem
                                            key={child.id}
                                            item={child}
                                            webAppUrl={this.props.webAppUrl + child.webAppUrl}
                                            isGuest={this.props.isGuest}
                                            showLoginWarning={this.props.showLoginWarning}
                                            projectId={this.props.projectId}
                                        />
                                    ))}
                                </NavDropdown>
                            ) : (
                                <MenuItem
                                    key={item.id}
                                    item={item}
                                    webAppUrl={this.props.webAppUrl + item.webAppUrl}
                                    isGuest={this.props.isGuest}
                                    showLoginWarning={this.props.showLoginWarning}
                                    projectId={this.props.projectId}
                                />
                            );
                        })}
                    </ul>
                )}
            </nav>
        </div>
    );
};

export default Menu;

const HamburgerMenu: React.SFC<{ onToggle: { (): void } }> = (props: { onToggle: { (): void } }) => {
    return (
        <a className="hamburger" onClick={props.onToggle}>
            <i className="fa fa-2x fa-bars" />
        </a>
    );
};

interface NavDropdown {
    title: string;
    id: string;
    onOpen: { (id: string): void };
    opening: string;
}

const NavDropdown: React.ComponentClass<NavDropdown, { open: boolean }> = class extends React.Component<
    NavDropdown,
    { open: boolean }
> {
    constructor(props: NavDropdown) {
        super(props);
        this.state = { open: false };
    }

    componentWillReceiveProps = (nextProps: NavDropdown) => {
        if (nextProps.opening && nextProps.opening != this.props.id) this.setState({ open: false });
    };

    toggleVisibility = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        this.props.onOpen(this.props.id);
        this.setState({ open: !this.state.open });
    };
    render = () => {
        const dropdownClass = this.state.open ? "up" : "down";
        return (
            <li onMouseEnter={this.toggleVisibility} onMouseLeave={this.toggleVisibility}>
                <a href="#" onClick={this.toggleVisibility} className="nav-item">
                    {this.props.title}
                    &nbsp;
                    <i className={`fa fa-chevron-${dropdownClass}`} />
                </a>
                <ul className="dropdown-list">{this.state.open && this.props.children}</ul>
            </li>
        );
    };
};

//todo: add <Link> option for items that correspond to routes
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
