import React, { useContext } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { NavLink } from "react-router-dom";
import { UserContext } from "../User";

const NavBar = () => {
    const userContext = useContext(UserContext);

    const logout = () => {
        userContext.setUser({
            loggedIn: false,
            username: '',
            playerId: ''
        });
    }

    return (
        <Navbar bg="dark" expand="sm" variant="dark">
            <Container>
                <Navbar.Brand>Bluedom</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="home">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="leaderboard">Leaderboard</Nav.Link>
                        <Nav.Link as={NavLink} to="shop">Shop</Nav.Link>
                    </Nav>
                    {userContext.user.loggedIn && <Nav className="justify-content-end">
                        <Navbar.Text>{userContext.user.username}</Navbar.Text> 
                        <Nav.Link as={Button} variant="link" onClick={logout}>Logout</Nav.Link>
                    </Nav>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar;