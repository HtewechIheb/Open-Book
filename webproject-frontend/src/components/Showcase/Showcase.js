import React from 'react';
import styles from './Showcase.module.css';

const Showcase = (props) => {
    return (
        <section className={styles.showcase}>
            <h1>Free Courses Online</h1>
            <p>Start learning and expanding your knowledge today for free!</p>
        </section>
    );
}

export default Showcase;