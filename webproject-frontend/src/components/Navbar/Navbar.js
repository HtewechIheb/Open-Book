import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faUserGraduate, faChalkboardTeacher, faUserCog, faUser, faDoorOpen, faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';

const Navbar = (props) => {
    const context = useContext(AuthContext);

    let Authentication = null;
    let userIcon = null;

    switch (context.user.role) {
        case "system-admin": 
        case "admin": userIcon = <FontAwesomeIcon icon={faUserCog} className={styles.icon} />
            break;
        case "teacher": userIcon = <FontAwesomeIcon icon={faChalkboardTeacher} className={styles.icon} />
            break;
        case "student": userIcon = <FontAwesomeIcon icon={faUserGraduate} className={styles.icon} />
            break;
        default: userIcon = <FontAwesomeIcon icon={faUser} className={styles.icon} />
    }

    if (context.isLoggedIn) {
        Authentication = (
            <React.Fragment>
                <li className="nav-item">
                    <NavLink className="nav-link" to={`/users/${context.user.id}`} exact>{userIcon}{context.user.name}</NavLink>
                </li>
                <li className="nav-item">
                    <a href="#" onClick={props.logoutHandler} className="nav-link"><FontAwesomeIcon icon={faDoorOpen} className={styles.icon} />Logout</a>
                </li>
            </React.Fragment>
        );
    }
    else {
        Authentication = (
            <React.Fragment>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/login" exact><FontAwesomeIcon icon={faSignInAlt} className={styles.icon} />Login</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/register" exact><FontAwesomeIcon icon={faUserPlus} className={styles.icon} />Register</NavLink>
                </li>
            </React.Fragment>
        );
    }

    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-dark fixed-top">
                <div className="container-xl">
                    <NavLink className="navbar-brand" to="/"><FontAwesomeIcon icon={faBookOpen} className={styles.icon} />OpenBook</NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/" exact>Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Courses
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    {(context.user.role === "teacher" || context.user.role === "admin") ? <Link className={`dropdown-item ${styles.dropdownItem}`} to="/courses/new">Create</Link> : null}
                                    <Link className={`dropdown-item ${styles.dropdownItem}`} to="/courses">View All</Link>
                                    <Link className={`dropdown-item ${styles.dropdownItem}`} to="/">View Categories</Link>
                                </div>
                            </li>
                        </ul>
                        <ul className="navbar-nav ml-auto">
                            {Authentication}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
export default Navbar;