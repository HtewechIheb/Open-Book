import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import styles from './Footer.module.css';

const Footer = (props) => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className="row">
                    <div className="col-6">
                        <h5><FontAwesomeIcon icon={faBookOpen} className={styles.icon} />OpenBook</h5>
                        <ul>
                            <li><small><NavLink to="/">Home</NavLink></small></li>
                            <li><small><NavLink to="#">Creators</NavLink></small></li>
                            <li><small><NavLink to="#">Contact Us</NavLink></small></li>
                        </ul>
                    </div>
                    <div className="col-6">
                        <h5><FontAwesomeIcon icon={faAddressBook} className={styles.icon} />Contact</h5>
                        <ul>
                            <li><small><NavLink to="#">Facebook</NavLink></small></li>
                            <li><small><NavLink to="#">Instagram</NavLink></small></li>
                            <li><small><NavLink to="#">Github</NavLink></small></li>
                        </ul>
                    </div>
                </div>
                <hr className={styles.lineBreak}/>
                <p className="text-center"><small>Copyright FSM &copy; 2019</small></p>
            </div>
        </footer>
    );
}

export default Footer;