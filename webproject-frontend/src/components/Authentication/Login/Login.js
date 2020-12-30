import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resetFlashMessages } from '../../../shared/utilities';
import FlashMessages from '../../FlashMessages';
import styles from './Login.module.css';

const Login = (props) => {
    let email, password, rememberMe;

    const handleLogin = e => {
        e.preventDefault();

        props.loginUser(email.value, password.value, rememberMe.checked);
    }

    useEffect(() => {
        resetFlashMessages();
    });

    return (
        <section className="body">
            <FlashMessages />
            <form className={styles.formLogin} onSubmit={handleLogin} method="POST" >
                <h1 className={styles.formTitle}>Login</h1>
                <div className="form-group">
                    <label htmlFor="inputEmail" className="sr-only">Email address</label>
                    <input ref={inputRef => email = inputRef} autoComplete="off" type="email" id="inputEmail" className="form-control" placeholder="Email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input ref={inputRef => password = inputRef} autoComplete="off" type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                </div>
                <div className="form-check">
                    <input ref={inputRef => rememberMe = inputRef} type="checkbox" className="form-check-input" id="rememberMe" name="rememberMe" />
                    <label className="form-check-label mb-3" htmlFor="rememberMe">Remember me</label>
                </div>

                <button className={`btn btn-lg btn-block btn-info`} type="submit">Sign in</button>
                <Link to="/register" className={`btn btn-lg btn-block btn-info`}>Register</Link>
                <div className="form-check mt-3">
                    <Link to="/forgot/password">Forgot Password ?</Link>
                </div>
            </form>
        </section>
    );
}

export default Login;