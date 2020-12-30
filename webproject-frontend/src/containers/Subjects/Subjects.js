import React, { Component } from 'react';
import FlashMessages from '../../components/FlashMessages';
import Subject from '../../components/Subject/Subject';
import styles from './Subjects.module.css';
import rulerImg from '../../images/ruler.png';
import computerImg from '../../images/computer.png';
import atomImg from '../../images/atom.png';
import flaskImg from '../../images/flask.png';
import bookshelfImg from '../../images/bookshelf.png';
import microscopeImg from '../../images/microscope.png';
import globegridImg from '../../images/globe-grid.png';
import openbookImg from '../../images/open-book.png';

class Subjects extends Component {

    render() {
        const subjects = [
            { id: 1, name: "Mathematics", paramName: "maths", image: rulerImg},
            { id: 2, name: "Computer Science", paramName: "cs", image: computerImg},
            { id: 3, name: "Physics", paramName: "physiques", image: atomImg},
            { id: 4, name: "Chemistry", paramName: "chimie", image: flaskImg},
            { id: 5, name: "Litterature", paramName: "litterature", image: bookshelfImg},
            { id: 6, name: "Experimental Sciences", paramName: "sciences", image: microscopeImg},
            { id: 7, name: "Geography", paramName: "geography", image: globegridImg},
            { id: 8, name: "History", paramName: "history", image: openbookImg},
        ]
        return (
            <section className={styles.subjects}>
                <div className="container">
                <FlashMessages />
                    <div className="row">
                        {subjects.map((subject) => {
                            return <Subject key={subject.id} subjectTitle={subject.name} subjectParamName={subject.paramName} subjectImage={subject.image} />
                        })}
                    </div>
                </div>
            </section>
        );
    }
}

export default Subjects;