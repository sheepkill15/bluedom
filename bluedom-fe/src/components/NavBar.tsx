import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from "react-router-dom";

const NavBar = () => {
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
                    <Nav className="justify-content-end">
                        <Nav.Link as={NavLink} to="login">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar;