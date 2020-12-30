import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import styles from './Course.module.css';

class Course extends Component {
    static getDerivedStateFromProps(props, state) {
        if (props.changed !== state.changed) {
            return { changed: props.changed };
        }
        return null;
    }

    constructor(changed) {
        super();
        this.state = {
            changed: changed,
        }
        this.decodeHTMLEntities = (() => { 
            const textArea = document.createElement('textarea'); 
            return (message) => { textArea.innerHTML = message; return textArea.value; }; 
        })();
    }

    static contextType = AuthContext;

    componentDidMount() {
        Axios({
            method: "get",
            url: "http://localhost:8000/api/courses/" + this.props.courseId + "/image",
            responseType: 'blob'
        })
            .then(response => {
                if (response.status === 204) {
                    return response
                }
                const img = window.URL.createObjectURL(new Blob([response.data]));
                this.image.src = img;
                return response;
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        var courseImg;
        switch (this.props.courseCategory) {
            case "other": courseImg = require('../../images/license.png');
                break;
            case "cs": courseImg = require('../../images/computer.png');
                break;
            case "maths": courseImg = require('../../images/ruler.png');
                break;
            case "physics": courseImg = require('../../images/atom.png');
                break;
            case "chemistry": courseImg = require('../../images/flask.png');
                break;
            case "litterature": courseImg = require('../../images/bookshelf.png');
                break;
            case "sciences": courseImg = require('../../images/microscope.png');
                break;
            case "geography": courseImg = require('../../images/globe-grid.png');
                break;
            case "histoire": courseImg = require('../../images/open-book.png');
                break;
            default: courseImg = require('../../images/license.png');
        }

        let downloadButton = (
            <span className={styles.courseButtons}>
                <button className={`${styles.courseBtn} btn btn-info btn-large`} onClick={() => this.props.downloadHandler(this.props.courseId, this.props.courseTitle)}>Download Course</button>
            </span>
        );
        let conditionalButtons = null;

        let subscribed = false;
        if ((this.context.user.role === "teacher" && this.context.user.id === this.props.courseUserId) || this.context.user.role === "admin") {
            conditionalButtons = (
                <React.Fragment>
                    <span className={styles.courseButtons}>
                        <Link to={`/courses/${this.props.courseId}/edit`} className={`${styles.courseBtn} btn btn-warning btn-large`}>Edit</Link>
                    </span>
                    <span className={styles.courseButtons}>
                        <button className={`${styles.courseBtn} btn btn-danger btn-large`} onClick={() => this.props.deleteHandler(this.props.courseId)}>Delete</button>
                    </span>
                </React.Fragment>
            );
        }
        else if (this.context.user.role === "student") {
            this.props.subscriptions.forEach(subscription => {
                if (subscription.title === this.props.courseTitle) {
                    subscribed = true;
                    if (subscription.pivot.status === "Passed") {
                        conditionalButtons = (
                            <React.Fragment>
                                <span className={styles.courseButtons}>
                                    <button className={`${styles.courseBtn} btn btn-outline-success btn-large`} disabled >Passed</button>
                                </span>
                            </React.Fragment>
                        );
                    }
                    else {
                        conditionalButtons = (
                            <React.Fragment>
                                <span className={styles.courseButtons}>
                                    <Link to={`/courses/${this.props.courseId}/test`} className={`${styles.courseBtn} btn btn-success btn-large`}>Pass Test</Link>
                                </span>
                            </React.Fragment>
                        );
                    }
                }
            });
            if (!conditionalButtons) {
                conditionalButtons = (
                    <React.Fragment>
                        <span className={styles.courseButtons}>
                            <button className={`${styles.courseBtn} btn btn-primary btn-large`} onClick={() => this.props.subscribeHandler(this.props.courseId)}>Subscribe</button>
                        </span>
                    </React.Fragment>
                );
            }
        }

        const buttons = (
            <React.Fragment>
                {this.context.user.role === "student" ? (subscribed ? downloadButton : null) : downloadButton}
                {conditionalButtons}
            </React.Fragment>
        );

        return (
            <article className={`${styles.courseCard} card`}>
                <div className="row no-gutters">
                    <div className="col-md-4">
                        <img ref={imgRef => this.image = imgRef} className={`${styles.courseImg} card-img`} src={courseImg} alt="course-img" />
                    </div>
                    <div className="col-md-8">
                        <div className={`${styles.courseBody} card-body`}>
                            <h2 className="card-title">{this.props.courseTitle}</h2>
                            <p className="card-text">{this.decodeHTMLEntities(this.props.courseDescription)}</p>
                            <p className="card-text"><small className="text-muted">Added on {this.props.courseDate}</small></p>
                            {this.context.isLoggedIn ? buttons : null}
                        </div>
                    </div>
                </div>
            </article>
        );
    }
}

export default Course;