import React from 'react';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { UserSessionActions } from 'wdk-client/Actions';

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
    }
}

const UserSection: React.SFC<{ user: User; webAppUrl: string }> = props => {
    const { user, webAppUrl } = props;
    const isGuest: boolean = user && user.isGuest ? true : false;
    return (
        isGuest
            ? <GuestUserMenu webAppUrl={webAppUrl} />
            : <RegisteredUserMenu user={user} />
    );
};

const GuestUserMenu: React.SFC<{ webAppUrl: string }> = props => {
    const { webAppUrl } = props;
    return (
        <div className="user-menu float-right mr-2">
            <span className="user-welcome">Welcome, Guest</span>
            <Button variant="dark" 
                onClick={() => window.location.assign(`${webAppUrl}/user/login`)} disabled>
                Login / Register
                </Button>
        </div>
    );
};

const RegisteredUserMenu: React.SFC<{ user: User }> = props => {
    const { user } = props;

    const userName = user ? "Welcome, " + user.properties.firstName + " " + user.properties.lastName : "Welcome, Guest";

    return (
        <div className="user-menu float-right mr-2">
            <DropdownButton variant="dark" id="dropdown-basic-button" title={userName} disabled>
                <Dropdown.Item href="/favorites"> <i className="fa fa-star"></i> Favorites</Dropdown.Item>
                <Dropdown.Item href="/logout">Logout</Dropdown.Item>
            </DropdownButton>
        </div>
    );
};

export default UserSection;

