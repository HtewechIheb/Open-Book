import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resetFlashMessages } from '../../../shared/utilities';
import FlashMessage from '../../FlashMessages';
import styles from './Register.module.css';

const Register = (props) => {
    let name, email, password, image, role;

    const handleRegister = e => {
        e.preventDefault();
        let imageFile = image.files[0];

        props.registerUser(name.value, email.value, password.value, imageFile, role.value);
    }

    useEffect(() => {
        resetFlashMessages();
    });

    return (
        <section className="body">
            <FlashMessage />
            <form className={styles.formRegister} onSubmit={handleRegister} method="POST" >
                <h1 className={styles.formTitle}>Register</h1>
                <div className="form-group">
                    <label htmlFor="inputName" className="sr-only">Name</label>
                    <input ref={inputRef => name = inputRef} autoComplete="off" type="text" id="inputName" className="form-control" placeholder="Name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="inputEmail" className="sr-only">Email address</label>
                    <input ref={inputRef => email = inputRef} autoComplete="off" type="email" id="inputEmail" className="form-control" placeholder="Email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input ref={inputRef => password = inputRef} autoComplete="off" type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                </div>
                <div className="form-group">
                    <label htmlFor="inputRole" className="sr-only">Role</label>
                    <select ref={inputRef => role = inputRef} id="inputRole" className="form-control" defaultValue="student" required>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>
                <div className="form-group">
                    <div className="text-left"><label htmlFor="inputImage">Profile Image</label></div>
                    <input ref={inputRef => image = inputRef} type="file" id="inputImage" className="form-control-file" />
                </div>
                <button className={`btn btn-lg btn-block btn-info`} type="submit">Register</button>
                <Link to="/login" className={`btn btn-lg btn-block btn-info`}>Login</Link>
            </form>
        </section>
    );
}

export default Register;