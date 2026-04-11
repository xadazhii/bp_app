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

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const LoginIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
);

const RegisterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showAdminBoard: false,
            currentUser: undefined,
            isTesting: false,
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

        EventBus.on("login", () => {
            const user = AuthService.getCurrentUser();
            if (user) {
                this.setState({
                    currentUser: user,
                    showAdminBoard: user.roles.includes("ROLE_ADMIN"),
                });
            }
        });

        EventBus.on("isTesting", (status) => {
            this.setState({ isTesting: status });
        });
    }

    componentWillUnmount() {
        EventBus.remove("logout");
        EventBus.remove("login");
        EventBus.remove("isTesting");
    }

    logOut() {
        AuthService.logout();
        this.setState({
            showAdminBoard: false,
            currentUser: undefined,
        });
    }

    render() {
        const { currentUser, showAdminBoard, isTesting } = this.state;

        const navLinkStyle = {
            color: '#000000',
            fontWeight: 'bold',
            fontSize: '1.1rem',
        };

        const navbarStyle = {
            backgroundColor: '#F5F5DC',
        };

        return (
            <div className="min-h-screen bg-[#0f172a]">
                {!isTesting && (
                    <nav className={`relative flex items-center justify-between px-3 sm:px-4 py-3 transition-all`} style={navbarStyle}>
                        <div className={`flex items-center gap-3 sm:gap-6`}>
                            <a href="https://www.fei.stuba.sk/" className="flex-shrink-0" style={navLinkStyle} target="_blank" rel="noopener noreferrer">
                                <img src="/images/STU-FEI-ancv.png" alt="Logo" className="w-24 sm:w-[120px] h-auto object-contain" />
                            </a>
                            <Link to={"/home"} className="text-black no-underline hover:text-blue-600 transition-colors" style={navLinkStyle}>
                                <span className="font-bold text-base sm:text-xl border-l-2 border-black/20 pl-4 sm:pl-5">BTSSS</span>
                            </Link>
                        </div>

                        <div className={`flex items-center gap-4 sm:gap-5 ml-auto`}>
                            {showAdminBoard && (
                                <Link to={"/admin"} className="text-black no-underline hover:text-blue-600 transition-all flex items-center gap-1.5" style={{ ...navLinkStyle, fontSize: '1.05rem' }}>
                                    <ShieldIcon className="w-5 h-5" />
                                    <span className="hidden md:inline">Administrácia</span>
                                </Link>
                            )}

                            {currentUser ? (
                                <Link to={"/profile"} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md no-underline" style={{ ...navLinkStyle, color: 'white', fontSize: '1rem' }}>
                                    <UserIcon className="w-5 h-5" />
                                    <span className="hidden sm:inline">Portál študenta</span>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <Link to={"/login"} className="text-black no-underline hover:text-blue-600 transition-colors flex items-center gap-1.5" style={navLinkStyle}>
                                        <LoginIcon className="w-5 h-5" />
                                        <span className="hidden md:inline">Prihlásenie</span>
                                    </Link>
                                    <Link to={"/register"} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md no-underline flex items-center gap-2" style={{ ...navLinkStyle, color: 'white', fontSize: '1rem' }}>
                                        <RegisterIcon className="w-5 h-5" />
                                        <span className="hidden sm:inline">Registrácia</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                )}

                <div className="bg-[#0f172a]">
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
            </div >
        );
    }
}

export default App;