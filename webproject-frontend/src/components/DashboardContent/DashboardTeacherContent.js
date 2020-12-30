import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardContent.module.css';

const DashboardTeacherContent = (props) => {
    let courses = <li className="list-group-item text-center">No courses available.</li>;

    if (props.courses.length !== 0) {
        courses = props.courses.map(course => {
            let category;
            switch (course.category) {
                case "other": category = "Other";
                    break;
                case "cs": category = "Computer Science";
                    break;
                case "maths": category = "Mathematics";
                    break;
                case "physics": category = "Physics";
                    break;
                case "chemistry": category = "Chemistry";
                    break;
                case "litterature": category = "Litterature";
                    break;
                case "sciences": category = "Sciences";
                    break;
                case "geography": category = "Géographie";
                    break;
                case "histoire": category = "History";
                    break;
                default: category = "other";
            }
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
                                {category}
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

    return (
        <div className={styles.dashboardContent}>
            <h1>Created Courses</h1>
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
                            Category
                        </div>
                    </strong>
                </li>
                {courses}
            </ul>
        </div>
    );
}

export default DashboardTeacherContent;