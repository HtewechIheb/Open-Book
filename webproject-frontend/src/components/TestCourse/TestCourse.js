import React, { Component } from 'react';
import Axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import { redirectOnFailure, resetFlashMessages } from '../../shared/utilities';
import styles from './TestCourse.module.css';

class TestCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: null
        }
        this.answers = [];
        this.decodeHTMLEntities = (() => { 
            const textArea = document.createElement('textarea'); 
            return (message) => { textArea.innerHTML = message; return textArea.value; }; 
        })();
    }

    static contextType = AuthContext;

    resultHandler = (e) => {
        e.preventDefault();

        let correctAnswers = 0;
        let answersNumber = 0;
        this.state.course.questions.forEach((question, questionIndex) => {
            question.answers.forEach((answer, answerIndex) => {
                let equivalentAnswer = (this.answers[questionIndex][answerIndex].checked ? 1 : 0);
                if (answer.correct === equivalentAnswer) {
                    correctAnswers++;
                }
                else if (answer.correct === 0 && equivalentAnswer === 1) {
                    correctAnswers--;
                }
                answersNumber++;
            });
        });

        if (correctAnswers >= Math.ceil(answersNumber * 70 / 100)) {
            this.props.resultHandler(this.props.match.params.id);
        }
        else {
            return redirectOnFailure(this, "/", "Test Failed, Please Try Again!", "push");
        }
    }

    componentDidMount() {
        Axios
            .get("http://localhost:8000/api/courses/" + this.props.match.params.id)
            .then(json => {
                Axios
                    .get("http://localhost:8000/api/courses/subscriptions")
                    .then(json => {
                        let subscribed = false;
                        json.data.forEach(subscription => {
                            if (subscription.id === this.state.course.id) {
                                subscribed = true;
                            }
                        });
                        if (!subscribed) {
                            return redirectOnFailure(this, "/courses", "Only Subscribed Students Can Pass The Test!", "push");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        return redirectOnFailure(this, "/courses", "Something Went Wrong, Could Not Get User Subscriptions!", "push");
                    });
                return json;
            })
            .then(json => {
                return this.setState({ course: json.data });
            })
            .catch(error => {
                console.log(error);
                return redirectOnFailure(this, "/courses", "Something Went Wrong, Could Not Get Test!", "push");
            });
        resetFlashMessages();
    }

    componentDidUpdate() {
        resetFlashMessages();
    }

    render() {
        let QCM = null;
        if (this.state.course) {
            QCM = this.state.course.questions.map((question, questionIndex) => {
                return (
                    <React.Fragment key={question.id}>
                        <div>
                            <p>{this.decodeHTMLEntities(question.text)} ?</p>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[questionIndex] = []; this.answers[questionIndex][0] = inputRef }} type="checkbox" id={`answerCheck-${questionIndex}-${questionIndex + 1}`} className="form-check-input" />
                                    <label className="form-check-label" htmlFor={`answerCheck-${questionIndex}-${questionIndex + 1}`}>{this.decodeHTMLEntities(question.answers[0].text)}</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[questionIndex][1] = inputRef }} type="checkbox" id={`answerCheck-${questionIndex}-${questionIndex + 2}`} className="form-check-input" />
                                    <label className="form-check-label" htmlFor={`answerCheck-${questionIndex}-${questionIndex + 2}`}>{this.decodeHTMLEntities(question.answers[1].text)}</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[questionIndex][2] = inputRef }} type="checkbox" id={`answerCheck-${questionIndex}-${questionIndex + 3}`} className="form-check-input" />
                                    <label className="form-check-label" htmlFor={`answerCheck-${questionIndex}-${questionIndex + 3}`}>{this.decodeHTMLEntities(question.answers[2].text)}</label>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                );
            });
        }
        return (
            <section className="body" >
                <div className="container">
                    <form className={styles.formTest} onSubmit={this.resultHandler} method="POST">
                        <h1 className={styles.formTitle}>{this.state.course ? this.state.course.title : null}</h1>
                        {QCM}
                        <div className="text-center mt-4">
                            <button className={`btn btn-lg btn-info mt-4`} type="submit">Validate</button>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
}

export default TestCourse;

