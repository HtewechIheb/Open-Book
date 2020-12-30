import React, { Component } from 'react';
import Axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import { redirectOnFailure, redirectOnSuccess, resetFlashMessages } from '../../shared/utilities';
import FlashMessages from '../../components/FlashMessages';
import Course from '../../components/Course/Course';
import styles from './Courses.module.css';


class Courses extends Component {
    state = {
        courses: [],
        subscriptions: [],
        changed: false
    }

    static contextType = AuthContext;

    downloadCourseHandler = (id, name) => {
        if (this.context.user.role === "student") {
            Axios
                .get("http://localhost:8000/api/courses/subscriptions")
                .then(json => {
                    let subscribed = false;
                    json.data.forEach(subscription => {
                        if (subscription.id === id) {
                            subscribed = true;
                        }
                    });
                    if (!subscribed) {
                        return redirectOnFailure(this, this.props.location.pathname, "Only Subscribed Students Can Pass The Test!", "replace");
                    }
                    else {
                        return Axios({
                            method: "get",
                            url: "http://localhost:8000/api/courses/" + id + "/file",
                            responseType: 'blob'
                        })
                            .then(response => {
                                console.log(response);
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', name + '.pdf');
                                document.body.appendChild(link);
                                link.click();
                                return response;
                            })
                            .catch(error => {
                                console.log(error);
                                return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Download Course!", "replace");
                            });
                    }
                })
                .catch(error => {
                    console.log(error);
                    return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get User Subscriptions!", "replace");
                });
        }
        else {
            Axios({
                method: "get",
                url: "http://localhost:8000/api/courses/" + id + "/file",
                responseType: 'blob'
            })
                .then(response => {
                    console.log(response);
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', name + '.pdf');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    return response;
                })
                .catch(error => {
                    console.log(error);
                    return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Download Course!", "replace");
                });
        }
    }

    deleteCourseHandler = (id) => {
        Axios({
            method: "post",
            url: "http://localhost:8000/api/courses/" + id,
            data: { _method: "delete" }
        })
            .then(json => {
                return Axios
                    .get("http://localhost:8000/api/courses")
                    .then(json => {
                        this.setState({ courses: json.data });
                        return redirectOnSuccess(this, this.props.location.pathname, "Successfully Deleted Course!", "replace");
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Courses!", "replace");
                    });
            })
            .catch(error => {
                console.log(error);
                return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Courses!", "replace");
            });
    }

    subscribeHandler = (id) => {
        Axios({
            method: "post",
            url: "http://localhost:8000/api/courses/" + id + "/subscriptions"
        })
            .then(json => {
                return Axios({
                    method: "get",
                    url: "http://localhost:8000/api/courses/subscriptions"
                })
                    .then(json => {
                        this.setState({ subscriptions: json.data });
                        return redirectOnSuccess(this, this.props.location.pathname, "Successfully Subscribed To Course!", "replace");
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Subscriptions!", "replace");
                    });
            })
            .catch(error => {
                console.log(error);
                return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Subscriptions!", "replace");
            });

    }

    componentDidMount() {
        if (this.props.match.params.category) {
            Axios
                .get("http://localhost:8000/api/courses/", {
                    params: {
                        category: this.props.match.params.category
                    }
                })
                .then(json => {
                    return this.setState({ courses: json.data });
                })
                .catch(error => {
                    console.log(error);
                    return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Courses!", "replace");
                });
        }
        else {
            Axios
                .get("http://localhost:8000/api/courses")
                .then(json => {
                    return this.setState({ courses: json.data });
                })
                .catch(error => {
                    console.log(error);
                    return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Courses!", "replace");
                });
        }
        if (this.context.user.role === "student") {
            Axios({
                method: "get",
                url: "http://localhost:8000/api/courses/subscriptions",
            })
                .then(json => {
                    return this.setState({ subscriptions: json.data });
                })
                .catch(error => {
                    console.log(error);
                    return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get User Subsriptions!", "replace");
                });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.category !== prevProps.match.params.category) {
            if (this.props.match.params.category) {
                Axios
                    .get("http://localhost:8000/api/courses/", {
                        params: {
                            category: this.props.match.params.category
                        }
                    })
                    .then(json => {
                        return this.setState({ courses: json.data });
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Courses!", "replace");
                    });
            }
            else {
                Axios
                    .get("http://localhost:8000/api/courses")
                    .then(json => {
                        return this.setState({ courses: json.data });
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Courses!", "replace");
                    });
            }
        }
        resetFlashMessages();
    }

    render() {
        return (
            <section className={styles.courses}>
                <h1 className={`text-center ${styles.title}`}>Courses</h1>
                <div className="container">
                    <FlashMessages />
                    <div className="row">
                        {this.state.courses.map((course) => {
                            return <Course
                                key={course.id}
                                courseId={course.id}
                                courseUserId={course.user_id}
                                courseTitle={course.title}
                                courseDescription={course.description}
                                courseImage={course.course_image}
                                courseFile={course.course_file}
                                courseDate={course.created_at}
                                courseCategory={course.category}
                                subscriptions={this.state.subscriptions}
                                subscribeHandler={this.subscribeHandler}
                                changed={this.state.changed}
                                downloadHandler={this.downloadCourseHandler}
                                deleteHandler={this.deleteCourseHandler} />
                        })}
                    </div>
                </div>
            </section>
        );
    }
}

export default Courses;