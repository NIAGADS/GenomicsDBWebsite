import React, { useState, useRef } from "react";
import { useClickAway } from "./../../../../hooks";
import { get } from "lodash";

interface User {
    isGuest: boolean;
    id: number;
    email: string;
    properties: {
        firstName: string;
        lastName: string;
        organization: string;
        middleName: string;
        group: string;
    };
}

const UserSection: React.FC<{ user: User; webAppUrl: string }> = ({ user, webAppUrl }) => (
    <div className="user-menu">
        {get(user, "isGuest", true) ? <GuestUserMenu webAppUrl={webAppUrl} /> : <RegisteredUserMenu user={user} />}
    </div>
);

const GuestUserMenu: React.FC<{ webAppUrl: string }> = (props) => {
    const { webAppUrl } = props;
    return (
        <div className="guest-user-menu mr-2">
            <span className="guest-user-welcome mr-2">Welcome, Guest</span>
            <button className="btn btn-dark" onClick={() => window.location.assign(`${webAppUrl}/user/login`)} disabled>
                Login / Register
            </button>
        </div>
    );
};

const RegisteredUserMenu: React.FC<{ user: User }> = ({ user }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false),
        userName = user ? "Welcome, " + user.properties.firstName + " " + user.properties.lastName : "Welcome, Guest",
        containerRef = useRef<any>();

    useClickAway(containerRef, () => setDropdownOpen(false));

    return (
        <div ref={containerRef} className="registered-user-menu mr-2">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="btn btn-dark" id="dropdown-basic-button">
                {userName}
            </button>
            {dropdownOpen && (
                <ul className="niagads-dropdown-menu" style={{ minWidth: get(containerRef, "current.clientWidth") }}>
                    <li className="niagads-dropdown-item">
                        <a href="/favorites">
                            {" "}
                            <i className="fa fa-star"></i>&nbsp;Favorites
                        </a>
                    </li>
                    <li className="niagads-dropdown-item">
                        {" "}
                        <a href="/logout">Logout</a>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default UserSection;
