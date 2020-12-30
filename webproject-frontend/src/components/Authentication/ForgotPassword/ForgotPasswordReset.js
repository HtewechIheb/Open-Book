import React, { useEffect } from 'react';
import { resetFlashMessages } from '../../../shared/utilities';
import FlashMessage from '../../FlashMessages';
import styles from './ForgotPassword.module.css';

const ForgotPasswordReset = (props) => {
    let email, password, passwordConfirmation;

    const handlePasswordReset = e => {
        e.preventDefault();

        props.handlePasswordReset(email.value, password.value, passwordConfirmation.value, props.match.params.token);
    }

    useEffect(() => {
        resetFlashMessages();
    });

    return (
        <section className="body">
            <FlashMessage />
            <form className={styles.formForgot} onSubmit={handlePasswordReset} method="POST" >
                <h1 className={styles.formTitle}>Reset Password</h1>
                <div className="form-group">
                    <label htmlFor="inputEmail" className="sr-only">Email address</label>
                    <input ref={inputRef => email = inputRef} autoComplete="off" type="email" id="inputEmail" className="form-control" placeholder="Email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input ref={inputRef => password = inputRef} type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                </div>
                <div className="form-group">
                    <label htmlFor="inputPasswordConfirmation" className="sr-only">Password Confirmation</label>
                    <input ref={inputRef => passwordConfirmation = inputRef} type="password" id="inputPasswordConfirmation" className="form-control" placeholder="Confirm Password" required />
                </div>
                <button className={`btn btn-lg btn-block btn-info`} type="submit">Reset Password</button>
            </form>
        </section>
    );
}

export default ForgotPasswordReset;