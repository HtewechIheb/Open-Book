import React, { Component } from 'react';
import Axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import { redirectOnFailure, redirectOnSuccess, resetFlashMessages } from '../../shared/utilities';
import FlashMessages from '../../components/FlashMessages';
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar';
import DashboardStudentContent from '../../components/DashboardContent/DashboardStudentContent';
import DashboardTeacherContent from '../../components/DashboardContent/DashboardTeacherContent';
import DashboardAdminContent from '../../components/DashboardContent/DashboardAdminContent';
import styles from './Dashboard.module.css';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            subscriptions: [],
            users: []
        }
        this.userImage = React.createRef();
    }

    static contextType = AuthContext;

    deleteCourseHandler = (id) => {
        Axios({
            method: "post",
            url: "http://localhost:8000/api/courses/" + id,
            data: {
                _method: "DELETE"
            },
        })
            .then(json => {
                return Axios({
                    method: "get",
                    url: "http://localhost:8000/api/users/courses",
                })
                    .then(json => {
                        this.setState({ courses: json.data });
                        return redirectOnSuccess(this, this.props.location.pathname, "Course Successfully Deleted!", "replace");
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Courses!", "replace");
                    });
            })
            .catch(error => {
                console.log(error);
                return redirectOnFailure(this, this.props.location.pathname, "Course Deletion Failed!", "replace");
            });
    }

    deleteSubscriptionHandler = (course_id, user_id = null) => {
        Axios({
            method: "post",
            url: "http://localhost:8000/api/courses/" + course_id + "/subscriptions",
            data: {
                _method: "DELETE",
                param_user_id: user_id
            },
        })
            .then(json => {
                return Axios({
                    method: "get",
                    url: "http://localhost:8000/api/courses/subscriptions",
                })
                    .then(json => {
                        this.setState({ subscriptions: json.data });
                        return redirectOnSuccess(this, this.props.location.pathname, "Subscription Successfully Deleted!", "replace");
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Subscriptions!", "replace");
                    });
            })
            .catch(error => {
                console.log(error);
                return redirectOnFailure(this, this.props.location.pathname, "Subscription Deletion Failed!", "replace");
            });
    }

    deleteUserHandler = (id) => {
        Axios({
            method: "post",
            url: "http://localhost:8000/api/users/" + id,
            data: {
                _method: "DELETE",
            },
        })
            .then(json => {
                return Axios({
                    method: "get",
                    url: "http://localhost:8000/api/users",
                })
                    .then(json => {
                        this.setState({ users: json.data })
                        return redirectOnSuccess(this, this.props.location.pathname, "User Successfully Deleted!", "replace");
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, this.props.location.pathname, "Subscription Deletion Failed!", "replace");
                    });
            })
            .catch(error => {
                console.log(error);
                return redirectOnFailure(this, this.props.location.pathname, "User Deletion Failed!", "replace");
            });
    }

    downloadCourseHandler = (id, name) => {
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
                return response;
            })
            .catch(error => {
                console.log(error);
                return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Download Course!", "replace");
            });

    }

    async componentDidMount() {
        if (this.context.user.role === "student") {
            Axios({
                method: "get",
                url: "http://localhost:8000/api/courses/subscriptions"
            })
                .then(json => {
                    return this.setState({ subscriptions: json.data });
                })
                .catch(error => {
                    console.log(error);
                    return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Subscriptions!", "replace");
                });
        }
        if (this.context.user.role === "teacher") {
            Axios({
                method: "get",
                url: "http://localhost:8000/api/users/courses",
            })
                .then(json => {
                    return this.setState({ courses: json.data });
                })
                .catch(error => {
                    console.log(error);
                    return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Courses!", "replace");
                });
        }
        if (this.context.user.role === "admin") {
            const [coursesData, subscriptionsData, usersData] = await Promise.all([
                Axios({
                    method: "get",
                    url: "http://localhost:8000/api/users/courses",
                })
                    .then(json => {
                        return json.data;
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Courses!", "replace");
                    }),
                Axios({
                    method: "get",
                    url: "http://localhost:8000/api/courses/subscriptions",
                })
                    .then(json => {
                        return json.data;
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Subscriptions!", "replace");
                    }),
                Axios({
                    method: "get",
                    url: "http://localhost:8000/api/users",
                })
                    .then(json => {
                        return json.data;
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Users!", "replace");
                    })
            ]);
            this.setState({ courses: coursesData, subscriptions: subscriptionsData, users: usersData });
        }
        if (this.context.user.role === "system-admin") {
            Axios({
                method: "get",
                url: "http://localhost:8000/api/users",
            })
                .then(json => {
                    return this.setState({ users: json.data });
                })
                .catch(error => {
                    console.log(error);
                    return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Users!", "replace");
                });
        }
        Axios({
            method: "get",
            url: "http://localhost:8000/api/users/image",
            responseType: 'blob'
        })
            .then(response => {
                if (response.status === 204) {
                    return response;
                }
                const img = window.URL.createObjectURL(new Blob([response.data]));
                this.userImage.current.src = img;
                return response;
            })
            .catch(error => {
                console.log(error);
                return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Could Not Get Users!", "replace");
            });
    }

    componentDidUpdate() {
        resetFlashMessages();
    }

    render() {

        let dashboardContent;
        if (this.context.user.role === "student") {
            dashboardContent = <DashboardStudentContent subscriptions={this.state.subscriptions} deleteSubscriptionHandler={this.deleteSubscriptionHandler} downloadHandler={this.downloadCourseHandler} />
        }
        else if (this.context.user.role === "teacher") {
            dashboardContent = <DashboardTeacherContent courses={this.state.courses} deleteCourseHandler={this.deleteCourseHandler} />
        }
        else if (this.context.user.role === "admin" || this.context.user.role === "system-admin") {
            dashboardContent = <DashboardAdminContent user={this.context.user} courses={this.state.courses} subscriptions={this.state.subscriptions} users={this.state.users} deleteCourseHandler={this.deleteCourseHandler} deleteSubscriptionHandler={this.deleteSubscriptionHandler} deleteUserHandler={this.deleteUserHandler} />
        }

        return (
            <div className="body container">
                <FlashMessages />
                <section className="row">
                    <aside className="col-md-4">
                        <DashboardSidebar ref={this.userImage} />
                    </aside>
                    <section className="col-md-8">
                        {dashboardContent}
                    </section>
                </section>
            </div>
        );
    }
}

export default Dashboard;