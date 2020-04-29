import React from "react";
import MainPage from "../pages/Main";
import ViewPastePage from "../pages/ViewPaste";
import {Route, Switch, Link} from "react-router-dom";
import {Col, Container, Navbar, NavbarBrand, Row} from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import {ErrorOverlay} from "../components/ErrorOverlay";
import {MinecraftEasterEgg} from "../pages/MinecraftEasterEgg";

class Main extends React.Component {
    render() {
        return (
            <div className="content-wrapper">
                <Navbar sticky="top" className="mb-3">
                    <NavbarBrand>
                        <Link to="/">
                            <svg viewBox="0 0 100 35">
                                <defs>
                                    <mask id="navbar-brand-mask">
                                        <rect x="0" y="0" height="40" width="100" fill="#fff"/>
                                        <text textAnchor="middle" x="50" y="26" dy="1">zbin</text>
                                    </mask>
                                </defs>
                                <rect x="0" y="0" height="35" width="100" mask="url(#navbar-brand-mask)"/>
                            </svg>
                        </Link>
                    </NavbarBrand>
                </Navbar>
                <Switch>
                    <Route path="/404" render={() => <ErrorOverlay status="404" />}/>
                    <Route path="/500" render={() => <ErrorOverlay status="error." />}/>
                    <Route path="/minecraft" render={() => <MinecraftEasterEgg/>}/>
                    <Route path="/:pasteUrl" render={() => <ViewPastePage />}/>
                    <Route path="/" render={() => <MainPage />}/>
                </Switch>
                <Container className="footer mt-5 py-3">
                    <Row>
                        <Col>
                            <h6 className="author-name">shadowusr’s</h6>
                            <h1 className="brand-name">zbin</h1>
                        </Col>
                        <Col className="links d-flex align-items-center justify-content-end">
                            <a href="https://github.com/shadowusr/" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"/>Github</a>
                        </Col>
                    </Row>
                </Container>
                <div className="footer-bg"/>
            </div>
        );
    }
}

export default Main;