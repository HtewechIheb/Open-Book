import React, { Component } from 'react';
import Axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import { redirectOnFailure, resetFlashMessages } from '../../shared/utilities';
import FlashMessage from '../FlashMessages';
import styles from './EditCourse.module.css';

class EditCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "info",
            info: [],
            file: null,
            image: null,
            course: null
        }
        this.questions = [];
        this.answers = [];
        this.decodeHTMLEntities = (() => { 
            const textArea = document.createElement('textarea'); 
            return (message) => { textArea.innerHTML = message; return textArea.value; }; 
        })();
    }

    static contextType = AuthContext;

    nextHandler = (e) => {
        e.preventDefault();

        const file = this.file.files[0];
        const image = this.image.files[0];
        this.setState({
            step: "questions",
            info: {
                title: this.title.value,
                description: this.description.value,
                category: this.category.value
            },
            file: file,
            image: image,
        });
    }

    editHandler = (e) => {
        e.preventDefault();

        const questionsArray = this.questions.map(question => {
            return question.value;
        });

        const answersArray = this.answers;
        for (let i = 0; i < answersArray.length; i++) {
            answersArray[i] = answersArray[i].map(answer => {
                return {
                    text: answer[0].value,
                    correct: (answer[1].checked === true ? 1 : 0)
                };
            })
        }

        this.props.editCourseHandler(this.state.info.title, this.state.info.description, this.state.file, this.state.image, this.state.info.category, this.props.match.params.id, questionsArray, answersArray);
    }

    componentDidMount() {
        Axios
            .get("http://localhost:8000/api/courses/" + this.props.match.params.id)
            .then(json => {
                if (this.context.user.role !== "admin") {
                    if (this.context.user.role !== "teacher" || (this.context.user.role === "teacher" && this.context.user.id !== json.data.user_id))
                        return redirectOnFailure(this, "/", "Unauthorized, You Don't Have Permission To Access This Section!", "push");
                }
                this.title.value = json.data.title;
                this.description.value = json.data.description;
                this.category.value = json.data.category;
                return this.setState({ course: json.data });
            })
            .catch(error => {
                console.log(error);
                return redirectOnFailure(this, "/", "Something Went Wrong, Could Not Get Course Data!", "push");
            });
        resetFlashMessages();
    }

    componentDidUpdate() {
        resetFlashMessages();
    }

    render() {
        let content;
        if (this.state.step === "info") {
            content = (
                <div className="container" key="info">
                    <form className={styles.formEdit} onSubmit={this.nextHandler} method="POST">
                        <h1 className={styles.formTitle}>Edit Course</h1>
                        <div className="form-group">
                            <label htmlFor="inputTitle" className="sr-only">Title</label>
                            <input ref={inputRef => this.title = inputRef} autoComplete="off" type="text" id="inputTitle" className="form-control" placeholder="Title" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputDescription" className="sr-only">Description</label>
                            <textarea ref={inputRef => this.description = inputRef} type="text" id="inputDescription" className="form-control" placeholder="Description" rows="10"></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputFile"><strong>Fichier de cours</strong></label>
                            <input ref={inputRef => this.file = inputRef} type="file" id="inputFile" className="form-control-file" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputImage"><strong>Image de cours</strong></label>
                            <input ref={inputRef => this.image = inputRef} type="file" id="inputImage" className="form-control-file" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputCategory"><strong>Catégorie</strong></label>
                            <select ref={inputRef => this.category = inputRef} id="inputCategory" className="form-control">
                                <option value="other">Autre</option>
                                <option value="maths">Mathématiques</option>
                                <option value="cs">Informatique</option>
                                <option value="physics">Physiques</option>
                                <option value="chemistry">Chimie</option>
                                <option value="litterature">Littérature</option>
                                <option value="sciences">Sciences Naturelles</option>
                                <option value="geography">Géographie</option>
                                <option value="history">Histoire</option>
                            </select>
                        </div>
                        <div className="text-center">
                            <button className={`btn btn-lg btn-info`} type="submit">Next</button>
                        </div>
                    </form>
                </div>
            );
        }
        else if (this.state.step === "questions") {
            content = (
                <div className="container" key="questions">
                    <form className={styles.formEdit} onSubmit={this.editHandler} method="POST">
                        <h1 className={styles.formTitle}>Edit Course</h1>
                        <div className="form-group">
                            <label htmlFor="inputQuestion1"><strong>Question 1</strong></label>
                            <input ref={inputRef => this.questions[0] = inputRef} type="text" id="inputQuestion1" className="form-control" placeholder="Question" defaultValue={this.decodeHTMLEntities(this.state.course.questions[0].text)} required />
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer1-1" className="sr-only">Answer 1-1</label>
                                    <input ref={inputRef => { this.answers[0] = []; this.answers[0][0] = []; this.answers[0][0][0] = inputRef }} type="text" id="inputAnswer1-1" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[0].answers[0].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[0][0][1] = inputRef }} type="checkbox" id="answerCheck1-1" className="form-check-input" defaultChecked={this.state.course.questions[0].answers[0].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck1-1">Correct</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer1-2" className="sr-only">Answer 1-2</label>
                                    <input ref={inputRef => { this.answers[0][1] = []; this.answers[0][1][0] = inputRef }} type="text" id="inputAnswer1-2" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[0].answers[1].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[0][1][1] = inputRef }} type="checkbox" id="answerCheck1-2" className="form-check-input" defaultChecked={this.state.course.questions[0].answers[1].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck1-2">Correct</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer1-3" className="sr-only">Answer 1-3</label>
                                    <input ref={inputRef => { this.answers[0][2] = []; this.answers[0][2][0] = inputRef }} type="text" id="inputAnswer1-3" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[0].answers[2].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[0][2][1] = inputRef }} type="checkbox" id="answerCheck1-3" className="form-check-input" defaultChecked={this.state.course.questions[0].answers[2].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck1-3">Correct</label>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className="form-group">
                            <label htmlFor="inputQuestion2"><strong>Question 2</strong></label>
                            <input ref={inputRef => this.questions[1] = inputRef} type="text" id="inputQuestion2" className="form-control" placeholder="Question" defaultValue={this.decodeHTMLEntities(this.state.course.questions[1].text)} required />
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer2-1" className="sr-only">Answer 2-1</label>
                                    <input ref={inputRef => { this.answers[1] = []; this.answers[1][0] = []; this.answers[1][0][0] = inputRef }} type="text" id="inputAnswer2-1" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[1].answers[0].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[1][0][1] = inputRef }} type="checkbox" id="answerCheck2-1" className="form-check-input" defaultChecked={this.state.course.questions[1].answers[0].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck2-1">Correct</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer2-2" className="sr-only">Answer 2-2</label>
                                    <input ref={inputRef => { this.answers[1][1] = []; this.answers[1][1][0] = inputRef }} type="text" id="inputAnswer2-2" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[1].answers[1].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[1][1][1] = inputRef }} type="checkbox" id="answerCheck2-2" className="form-check-input" defaultChecked={this.state.course.questions[1].answers[1].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck2-2">Correct</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer2-3" className="sr-only">Answer 2-3</label>
                                    <input ref={inputRef => { this.answers[1][2] = []; this.answers[1][2][0] = inputRef }} type="text" id="inputAnswer2-3" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[1].answers[2].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[1][2][1] = inputRef }} type="checkbox" id="answerCheck2-3" className="form-check-input" defaultChecked={this.state.course.questions[1].answers[2].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck2-3">Correct</label>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className="form-group">
                            <label htmlFor="inputQuestion3"><strong>Question 3</strong></label>
                            <input ref={inputRef => this.questions[2] = inputRef} type="text" id="inputQuestion3" className="form-control" placeholder="Question" defaultValue={this.decodeHTMLEntities(this.state.course.questions[2].text)} required />
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer3-1" className="sr-only">Answer 3-1</label>
                                    <input ref={inputRef => { this.answers[2] = []; this.answers[2][0] = []; this.answers[2][0][0] = inputRef }} type="text" id="inputAnswer3-1" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[2].answers[0].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[2][0][1] = inputRef }} type="checkbox" id="answerCheck3-1" className="form-check-input" defaultChecked={this.state.course.questions[2].answers[0].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck3-1">Correct</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer3-2" className="sr-only">Answer 3-2</label>
                                    <input ref={inputRef => { this.answers[2][1] = []; this.answers[2][1][0] = inputRef }} type="text" id="inputAnswer3-2" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[2].answers[1].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[2][1][1] = inputRef }} type="checkbox" id="answerCheck3-2" className="form-check-input" defaultChecked={this.state.course.questions[2].answers[1].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck3-2">Correct</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer3-3" className="sr-only">Answer 3-3</label>
                                    <input ref={inputRef => { this.answers[2][2] = []; this.answers[2][2][0] = inputRef }} type="text" id="inputAnswer3-3" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[2].answers[2].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[2][2][1] = inputRef }} type="checkbox" id="answerCheck3-3" className="form-check-input" defaultChecked={this.state.course.questions[2].answers[2].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck3-3">Correct</label>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className="form-group">
                            <label htmlFor="inputQuestion4"><strong>Question 4</strong></label>
                            <input ref={inputRef => this.questions[3] = inputRef} type="text" id="inputQuestion4" className="form-control" placeholder="Question" defaultValue={this.decodeHTMLEntities(this.state.course.questions[3].text)} required />
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer4-1" className="sr-only">Answer 4-1</label>
                                    <input ref={inputRef => { this.answers[3] = []; this.answers[3][0] = []; this.answers[3][0][0] = inputRef }} type="text" id="inputAnswer4-1" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[3].answers[0].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[3][0][1] = inputRef }} type="checkbox" id="answerCheck4-1" className="form-check-input" defaultChecked={this.state.course.questions[3].answers[0].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck4-1">Correct</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer4-2" className="sr-only">Answer 4-2</label>
                                    <input ref={inputRef => { this.answers[3][1] = []; this.answers[3][1][0] = inputRef }} type="text" id="inputAnswer4-2" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[3].answers[1].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[3][1][1] = inputRef }} type="checkbox" id="answerCheck4-2" className="form-check-input" defaultChecked={this.state.course.questions[3].answers[1].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck4-2">Correct</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer4-3" className="sr-only">Answer 4-3</label>
                                    <input ref={inputRef => { this.answers[3][2] = []; this.answers[3][2][0] = inputRef }} type="text" id="inputAnswer4-3" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[3].answers[2].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[3][2][1] = inputRef }} type="checkbox" id="answerCheck4-3" className="form-check-input" defaultChecked={this.state.course.questions[3].answers[2].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck4-3">Correct</label>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className="form-group">
                            <label htmlFor="inputQuestion5"><strong>Question 5</strong></label>
                            <input ref={inputRef => this.questions[4] = inputRef} type="text" id="inputQuestion5" className="form-control" placeholder="Question" defaultValue={this.decodeHTMLEntities(this.state.course.questions[4].text)} required />
                        </div>
                        <div className="row mb-5">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer5-1" className="sr-only">Answer 5-1</label>
                                    <input ref={inputRef => { this.answers[4] = []; this.answers[4][0] = []; this.answers[4][0][0] = inputRef }} type="text" id="inputAnswer5-1" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[4].answers[0].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[4][0][1] = inputRef }} type="checkbox" id="answerCheck5-1" className="form-check-input" defaultChecked={this.state.course.questions[4].answers[0].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck5-1">Correct</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer5-2" className="sr-only">Answer 5-2</label>
                                    <input ref={inputRef => { this.answers[4][1] = []; this.answers[4][1][0] = inputRef }} type="text" id="inputAnswer5-2" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[4].answers[1].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[4][1][1] = inputRef }} type="checkbox" id="answerCheck5-2" className="form-check-input" defaultChecked={this.state.course.questions[4].answers[1].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck5-2">Correct</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputAnswer5-3" className="sr-only">Answer 5-3</label>
                                    <input ref={inputRef => { this.answers[4][2] = []; this.answers[4][2][0] = inputRef }} type="text" id="inputAnswer5-3" className="form-control" placeholder="Option" defaultValue={this.decodeHTMLEntities(this.state.course.questions[4].answers[2].text)} required />
                                </div>
                                <div className="form-check">
                                    <input ref={inputRef => { this.answers[4][2][1] = inputRef }} type="checkbox" id="answerCheck5-3" className="form-check-input" defaultChecked={this.state.course.questions[4].answers[2].correct ? true : false} />
                                    <label className="form-check-label" htmlFor="answerCheck5-3">Correct</label>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className={`btn btn-lg btn-info`} type="submit">Save</button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <section className="body">
                <FlashMessage />
                {content}
            </section>
        );
    }
}

export default EditCourse;