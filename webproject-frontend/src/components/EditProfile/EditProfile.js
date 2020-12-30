import React, { Component } from 'react';
import Axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import { redirectOnFailure, resetFlashMessages } from '../../shared/utilities';
import FlashMessage from '../FlashMessages';
import styles from './EditProfile.module.css';

class EditProfile extends Component {
    static contextType = AuthContext;

    handleEdit = e => {
        e.preventDefault();

        if(this.userDetails){
            if(this.userDetails.email === this.email.value){
                return this.props.editUser(this.name.value, null, this.password.value, this.role.value, this.image.files[0], this.props.match.params.id);
            }
        }

        this.props.editUser(this.name.value, this.email.value, this.password.value, this.role.value, this.image.files[0], this.props.match.params.id);
    }

    componentDidMount() {
        if (this.context.user.role !== "system-admin" && this.context.user.role !== "admin") {
            if (this.props.match.params.id != this.context.user.id) {
                return redirectOnFailure(this, "/", "Unauthorized, You Don't Have Permission To Access This Section!", "push");
            }
        }
        if (this.context.user.id != this.props.match.params.id) {
            Axios({
                method: "get",
                url: "http://localhost:8000/api/users/" + this.props.match.params.id,
            })
                .then(json => {
                    this.userDetails = {
                        name: json.data.name,
                        email: json.data.email,
                        role: json.data.role
                    }
                    this.name.value = json.data.name;
                    this.email.value = json.data.email;
                    this.role.value = json.data.role;
                    return json;
                })
                .catch(error => {
                    console.log(error);
                    return redirectOnFailure(this, "/", "Something Went Wrong, Could Not Get User Data!", "push");
                });
        }
        else {
            this.name.value = this.context.user.name;
            this.email.value = this.context.user.email;
            this.role.value = this.context.user.role;
        }
        resetFlashMessages();
    }

    componentDidUpdate() {
        resetFlashMessages();
    }

    render() {
        return (
            <section className="body">
                <FlashMessage />
                <form className={styles.formEdit} onSubmit={this.handleEdit} method="POST" >
                    <h1 className={styles.formTitle}>Edit Profile</h1>
                    <div className="form-group">
                        <label htmlFor="inputName" className="sr-only">Name</label>
                        <input ref={inputRef => this.name = inputRef} autoComplete="off" type="text" id="inputName" className="form-control" placeholder="Name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputEmail" className="sr-only">Email address</label>
                        <input ref={inputRef => this.email = inputRef} autoComplete="off" type="email" id="inputEmail" className="form-control" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputPassword" className="sr-only">Password</label>
                        <input ref={inputRef => this.password = inputRef} autoComplete="off" type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputRole" className="sr-only">Role</label>
                        <select ref={inputRef => this.role = inputRef} id="inputRole" className="form-control" defaultValue={this.context.user.role} disabled required>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="text-left"><label htmlFor="inputImage">Profile Image</label></div>
                        <input ref={inputRef => this.image = inputRef} type="file" id="inputImage" className="form-control-file" />
                    </div>
                    <button className={`btn btn-lg btn-block btn-info`} type="submit">Save</button>
                </form>
            </section>
        );
    }
}

export default EditProfile;