import React, { Component } from 'react';
import { resetFlashMessages } from '../../shared/utilities';
import Showcase from '../../components/Showcase/Showcase';
import Subjects from '../Subjects/Subjects';
import styles from './Home.module.css';

class Home extends Component {

    componentDidMount(){
        resetFlashMessages();
    }

    componentDidUpdate(){
        resetFlashMessages();
    }

    render() {
        if(this.props.location.state){
            if(this.props.location.state.type === "error"){
                sessionStorage["flash-error"] = this.props.location.state.flash;
                this.props.location.state = undefined;
            }
            else if(this.props.location.state.type === "success"){
                sessionStorage["flash-success"] = this.props.location.state.flash;
                this.props.location.state = undefined;
            }
        }
        return (
            <section>
                <Showcase />
                <Subjects />
            </section>
        );
    }
}

export default Home;