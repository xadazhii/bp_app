import React, { Component } from "react";
import AuthService from "../services/auth.service";
import { withRouter } from "../common/with-router";

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
            message: "",
            errors: {}
        };
    }

    validate = () => {
        const errors = {};
        if (!this.state.username) {
            errors.username = "Toto pole je povinné!";
        }
        if (!this.state.password) {
            errors.password = "Toto pole je povinné!";
        }
        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();

        if (!this.validate()) {
            return;
        }

        this.setState({
            message: "",
            loading: true
        });

        AuthService.login(this.state.username, this.state.password).then(
            () => {
                this.props.router.navigate("/profile");
                window.location.reload();
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        const { username, password, loading, message, errors } = this.state;

        return (
            <div
                className="min-h-screen flex items-center justify-center p-4"
                style={{ backgroundColor: "#0f172a" }}
            >
                <div
                    className="p-8 rounded-lg shadow-lg w-full max-w-md"
                    style={{ backgroundColor: "#F5F5DC" }}
                >
                    <div className="flex justify-center mb-6">
                        <svg
                            className="w-24 h-24 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>

                    <form onSubmit={this.handleLogin}>
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Používateľské meno
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={username}
                                onChange={this.onChangeUsername}
                            />
                            {errors.username && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2">
                                    {errors.username}
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Heslo
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                value={password}
                                onChange={this.onChangePassword}
                            />
                            {errors.password && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
                                disabled={loading}
                            >
                                {loading && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                <span>Prihlásiť sa</span>
                            </button>
                        </div>

                        {message && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                                role="alert"
                            >
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);