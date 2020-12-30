import React, { useEffect } from 'react';
import { resetFlashMessages } from '../../../shared/utilities';
import FlashMessage from '../../FlashMessages';
import styles from './ForgotPassword.module.css';

const ForgotPasswordSend = (props) => {
    let email;

    const handlePasswordResetLink = e => {
        e.preventDefault();

        props.handlePasswordResetLink(email.value);
    }

    useEffect(() => {
        resetFlashMessages();
    });

    return (
        <section className="body">
            <FlashMessage />
            <form className={styles.formForgot} onSubmit={handlePasswordResetLink} method="POST" >
                <h1 className={styles.formTitle}>Reset Password</h1>
                <div className="form-group">
                    <label htmlFor="inputEmail" className="sr-only">Email address</label>
                    <input ref={inputRef => email = inputRef} autoComplete="off" type="email" id="inputEmail" className="form-control" placeholder="Email" required />
                </div>
                <button className={`btn btn-lg btn-block btn-info`} type="submit">Send Reset Link</button>
            </form>
        </section>
    );
}

export default ForgotPasswordSend;