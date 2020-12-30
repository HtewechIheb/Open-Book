import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardContent.module.css';

const DashboardStudentContent = (props) => {
    let subscriptions = <li className="list-group-item text-center">No courses available.</li>;

    if (props.subscriptions.length !== 0) {
        subscriptions = props.subscriptions.map(subscription => {
            return (
                <React.Fragment key={subscription.id}>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-4 my-auto">
                                {subscription.title}
                            </div>
                            <div className="col-4 my-auto">
                                {subscription.created_at}
                            </div>
                            <div className="col-4 my-auto">
                                {subscription.pivot.status === "notPassed" ? <span className="text-danger">Not Passed</span> : <span className="text-success">Passed</span>}
                            </div>
                        </div>
                        <hr />
                        <div className={styles.dashboardContentButtons}>
                            <button className={`${styles.dashboardContentBtn} btn btn-info btn-sm`} onClick={() => props.downloadHandler(subscription.id, subscription.course_file)}>Download Course</button>
                            {subscription.pivot.status === "notPassed" ? <Link className={`${styles.dashboardContentBtn} btn btn-success btn-sm`} to={`/courses/${subscription.id}/test`}>Pass Test</Link> : <button className={`${styles.dashboardContentBtn} btn btn-outline-success btn-sm`} disabled>Passed</button>}
                            <button className={`${styles.dashboardContentBtn} btn btn-danger btn-sm`} onClick={() => props.deleteSubscriptionHandler(subscription.id)}>Unsubscribe</button>
                        </div>
                    </li>
                </React.Fragment>
            );
        });
    }

    return (
        <article className={styles.dashboardContent}>
            <h1>Subscribed Courses</h1>
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
                            Status
                        </div>
                    </strong>
                </li>
                {subscriptions}
            </ul>
        </article>
    );
}

export default DashboardStudentContent;