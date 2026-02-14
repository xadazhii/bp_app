import React, { Component } from "react";
import { isEmail } from "validator";
import AuthService from "../services/auth.service";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            email: "",
            password: "",
            successful: false,
            message: "",
            loading: false,
            errors: {}
        };
    }

    validate = () => {
        const errors = {};
        const { username, email, password } = this.state;

        if (!username) {
            errors.username = "Toto pole je povinné!";
        } else if (username.length < 3 || username.length > 20) {
            errors.username = "Používateľské meno musí mať 3 až 20 znakov.";
        }

        if (!email) {
            errors.email = "Toto pole je povinné!";
        } else if (!isEmail(email)) {
            errors.email = "Neplatný e-mail.";
        }

        if (!password) {
            errors.password = "Toto pole je povinné!";
        } else if (password.length < 6 || password.length > 40) {
            errors.password = "Heslo musí mať 6 až 40 znakov.";
        }

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    onChangeUsername(e) {
        this.setState({ username: e.target.value });
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value });
    }

    onChangePassword(e) {
        this.setState({ password: e.target.value });
    }

    handleRegister(e) {
        e.preventDefault();

        if (!this.validate()) {
            return;
        }

        this.setState({ message: "", successful: false, loading: true });

        const { username, email, password } = this.state;

        AuthService.register(username, email, password).then(
            response => {
                this.setState({
                    message: response.data.message,
                    successful: true,
                    loading: false
                });
            },
            error => {
                const resMessage =
                    (error.response?.data?.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    successful: false,
                    message: resMessage,
                    loading: false
                });
            }
        );
    }

    render() {
        const { username, email, password, successful, message, errors, loading } = this.state;

        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0f172a' }}>
                <div className="p-8 rounded-lg shadow-lg w-full max-w-md" style={{ backgroundColor: '#F5F5DC' }}>
                    <div className="flex justify-center mb-6">
                        <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>

                    <form onSubmit={this.handleRegister}>
                        {!successful && (
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                                        Používateľské meno
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={this.onChangeUsername}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.username && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 text-sm">
                                            {errors.username}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={this.onChangeEmail}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.email && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 text-sm">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                                        Heslo
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={this.onChangePassword}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.password && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 text-sm">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline flex justify-center items-center ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                    >
                                        {loading && (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        <span>Registrovať sa</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {message && (
                            <div className="mt-4">
                                <div
                                    className={`px-4 py-3 rounded relative ${
                                        successful
                                            ? "bg-green-100 border border-green-400 text-green-700"
                                            : "bg-red-100 border border-red-400 text-red-700"
                                    }`}
                                    role="alert"
                                >
                                    {message}
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        );
    }
}