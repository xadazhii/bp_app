import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardAdmin from "./components/board-admin.component";
import Simulation from "./components/simulation.component";
import EventBus from "./common/EventBus";

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showAdminBoard: false,
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showAdminBoard: user.roles.includes("ROLE_ADMIN"),
            });
        }

        EventBus.on("logout", () => {
            this.logOut();
        });
    }

    componentWillUnmount() {
        EventBus.remove("logout");
    }

    logOut() {
        AuthService.logout();
        this.setState({
            showAdminBoard: false,
            currentUser: undefined,
        });
    }

    render() {
        const { currentUser, showAdminBoard } = this.state;

        const navLinkStyle = {
            color: '#000000',
            fontWeight: 'bold',
            fontSize: '1.1rem',
        };

        const navbarStyle = {
            backgroundColor: '#F5F5DC',
        };

        return (
            <div>
                <nav className="navbar navbar-expand navbar-light" style={navbarStyle}>
                    <a href="https://www.fei.stuba.sk/" className="navbar-brand" style={navLinkStyle} target="_blank" rel="noopener noreferrer">
                        <img src="/images/STU-FEI-ancv.png" alt="Logo" style={{ width: "130px", height: "50px" }} />
                    </a>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"/home"} className="nav-link" style={navLinkStyle}>
                                BTSSS
                            </Link>
                        </li>

                        {showAdminBoard && (
                            <li className="nav-item">
                                <Link to={"/admin"} className="nav-link" style={navLinkStyle}>
                                    Administrácia
                                </Link>
                            </li>
                        )}
                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/profile"} className="nav-link" style={navLinkStyle}>
                                    Portál študenta
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={this.logOut} style={navLinkStyle}>
                                    Odhlásiť sa
                                </a>
                            </li>
                        </div>
                    ) : (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/login"} className="nav-link" style={navLinkStyle}>
                                    Prihlásenie
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to={"/register"} className="nav-link" style={navLinkStyle}>
                                    Registrácia
                                </Link>
                            </li>
                        </div>
                    )}
                </nav>

                <div className="container mt-3">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin" element={<BoardAdmin />} />
                        <Route path="/simulation" element={<Simulation />} />
                    </Routes>
                </div>
            </div>
        );
    }
}

export default App;