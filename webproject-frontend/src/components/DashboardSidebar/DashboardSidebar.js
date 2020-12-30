import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAt, faUserGraduate, faChalkboardTeacher, faUserCog } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../contexts/AuthContext';
import styles from './DashboardSidebar.module.css';
import noUserImage from '../../images/nouserimage.jpg';

const DashboardSidebar = React.forwardRef((props, ref) => {
    const context = useContext(AuthContext);
    
    let role;
    switch (context.user.role) {
        case "system-admin": role = <li><FontAwesomeIcon icon={faUserCog} className={styles.icon} />System Administrator</li>;
            break;
        case "admin": role = <li><FontAwesomeIcon icon={faUserCog} className={styles.icon} />Administrator</li>;
            break;
        case "teacher": role = <li><FontAwesomeIcon icon={faChalkboardTeacher} className={styles.icon} />Teacher</li>;
            break;
        case "student": role = <li><FontAwesomeIcon icon={faUserGraduate} className={styles.icon} />Student</li>;
            break;
        default: role = null;
    }

    return (
        <div className={styles.dashboardSidebar}>
            <img ref={ref} src={noUserImage} alt="user-img" className={styles.dashboardSidebarImg} />
            <hr />
            <div className={styles.dashboardSidebarInfo}>
                <ul>
                    <li><FontAwesomeIcon icon={faUser} className={styles.icon} />{context.user.name}</li>
                    <div className={styles.email}><li><FontAwesomeIcon icon={faAt} className={styles.icon} />{context.user.email}</li></div>
                    {role}
                </ul>
                <div className={styles.editBtn}>
                    <Link to={`/users/${context.user.id}/edit`} className="btn btn-primary">Edit Profile</Link>
                </div>
            </div>
        </div>
    );
});

export default DashboardSidebar;