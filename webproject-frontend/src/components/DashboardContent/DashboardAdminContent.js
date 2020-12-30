import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardContent.module.css';

const DashboardStudentContent = (props) => {
    let subscriptions = <li className="list-group-item text-center">No subscriptions available.</li>
    let courses = <li className="list-group-item text-center">No courses available.</li>;
    let users = <li className="list-group-item text-center">No users available.</li>;

    if (props.subscriptions.length !== 0) {
        subscriptions = props.subscriptions.map(subscription => {
            return (
                <React.Fragment key={subscription.id}>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-3 my-auto">
                                {subscription.user}
                            </div>
                            <div className="col-3 my-auto text-break">
                                {subscription.course}
                            </div>
                            <div className="col-3 my-auto">
                                {subscription.created_at}
                            </div>
                            <div className="col-3 my-auto">
                                {subscription.status === "notPassed" ? <span className="text-danger">Not Passed</span> : <span className="text-success">Passed</span>}
                            </div>
                        </div>
                        <hr />
                        <div className={styles.dashboardContentButtons}>
                            <button className={`${styles.dashboardContentBtn} btn btn-danger btn-sm`} onClick={() => props.deleteSubscriptionHandler(subscription.course_id, subscription.user_id)}>Delete</button>
                        </div>
                    </li>
                </React.Fragment>
            );
        });
    }

    if (props.courses.length !== 0) {
        courses = props.courses.map(course => {
            return (
                <React.Fragment key={course.id}>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-4 my-auto">
                                {course.title}
                            </div>
                            <div className="col-4 my-auto">
                                {course.created_at}
                            </div>
                            <div className="col-4 my-auto">
                                {course.user.name}
                            </div>
                        </div>
                        <hr />
                        <div className={styles.dashboardContentButtons}>
                            <Link to={`/courses/${course.id}/edit`} className={`${styles.dashboardContentBtn} btn btn-warning btn-sm`}>Edit</Link>
                            <button className={`${styles.dashboardContentBtn} btn btn-danger btn-sm`} onClick={() => props.deleteCourseHandler(course.id)}>Delete</button>
                        </div>
                    </li>
                </React.Fragment>
            );
        });
    }

    if (props.users.length !== 0) {
        users = props.users.map(user => {
            let buttons = (
                <div className={styles.dashboardContentButtons}>
                    <Link to={`/users/${user.id}/edit`} className={`${styles.dashboardContentBtn} btn btn-warning btn-sm`}>Edit</Link>
                    <button className={`${styles.dashboardContentBtn} btn btn-danger btn-sm`} onClick={() => props.deleteUserHandler(user.id)}>Delete</button>
                </div>
            );
            if (props.user.role === "admin") {
                if (user.role === "admin" || user.role === "system-admin") {
                    buttons = null;
                }
            }

            let role;
            switch (user.role) {
                case "system-admin": role = "System Administrator";
                    break;
                case "admin": role = "Administrator";
                    break;
                case "student": role = "Student";
                    break;
                case "teacher": role = "Teacher";
                    break;
                default:
            }

            return (
                <React.Fragment key={user.id}>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-4 my-auto text-break">
                                {user.email}
                            </div>
                            <div className="col-4 my-auto">
                                {user.created_at}
                            </div>
                            <div className="col-4 my-auto">
                                {role}
                            </div>
                        </div>
                        <hr />
                        {buttons}
                    </li>
                </React.Fragment>
            );
        });
    }

    let adminContent = null;
    if (props.user.role === "admin") {
        adminContent = (
            <React.Fragment>
                <article>
                    <h1>Subscriptions</h1>
                    <ul className="list-group text-left">
                        <li className="list-group-item">
                            <strong className="row">
                                <div className="col-3">
                                    Name
                            </div>
                                <div className="col-3">
                                    Course
                            </div>
                                <div className="col-3">
                                    Date
                            </div>
                                <div className="col-3">
                                    Status
                            </div>
                            </strong>
                        </li>
                        {subscriptions}
                    </ul>
                </article>
                <hr />
                <article>
                    <h1>Courses</h1>
                    <ul className="list-group text-left">
                        <li className="list-group-item">
                            <strong className="row">
                                <div className="col-4">
                                    Title
                            </div>
                                <div className="col-4">
                                    Date
                            </div>
                                <div className="col-4">
                                    Teacher
                            </div>
                            </strong>
                        </li>
                        {courses}
                    </ul>
                </article>
                <hr />
            </React.Fragment>
        );
    }

    return (
        <div className={styles.dashboardContent}>
            {adminContent}
            <article>
                <h1>Users</h1>
                <ul className="list-group text-left">
                    <li className="list-group-item">
                        <strong className="row">
                            <div className="col-4">
                                Email
                            </div>
                            <div className="col-4">
                                Date
                            </div>
                            <div className="col-4">
                                Role
                            </div>
                        </strong>
                    </li>
                    {users}
                </ul>
            </article>
        </div>
    );
}

export default DashboardStudentContent;