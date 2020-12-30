import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Subject.module.css';

const Subject = (props) => {
    return (
        <article className="col-sm-6 col-md-4 col-lg-3">
            <div className={`${styles.subjectCard} card`}>
                <div className="p-4"><img className="card-img-top" src={props.subjectImage} alt="subject-img" /></div>
                <div className="card-body">
                    <h3 className="card-title">{props.subjectTitle}</h3>
                    <Link to={`/courses/${props.subjectParamName}`} className={`${styles.cardBtn} btn btn-info`}>View Courses</Link>
                </div>
            </div>
        </article>
    );
}

export default Subject;