import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import ScrollToTop from 'react-router-scroll-top';
import ProtectedRoute from '../hoc/ProtectedRoute';
import UnprotectedRoute from '../hoc/UnprotectedRoute';
import { roles } from '../shared/roles';
import { redirectOnSuccess, redirectOnFailure } from '../shared/utilities';
import Home from './Home/Home';
import Login from '../components/Authentication/Login/Login';
import Register from '../components/Authentication/Register/Register';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Courses from '../containers/Courses/Courses';
import CreateCourse from '../components/CreateCourse/CreateCourse';
import EditCourse from '../components/EditCourse/EditCourse';
import Dashboard from '../containers/Dashboard/Dashboard';
import EditProfile from '../components/EditProfile/EditProfile';
import TestCourse from '../components/TestCourse/TestCourse';
import ForgotPasswordSend from '../components/Authentication/ForgotPassword/ForgotPasswordSend';
import ForgotPasswordReset from '../components/Authentication/ForgotPassword/ForgotPasswordReset';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    let currentState;
    if (sessionStorage["appState"]) {
      currentState = sessionStorage["appState"];
    }
    else if (localStorage["appState"]) {
      currentState = localStorage["appState"];
    }
    if (currentState) {
      let appState = JSON.parse(currentState);
      this.state = appState;
    }
    else {
      this.state = {
        isLoggedIn: false,
        user: {}
      }
    }
    sessionStorage["flash-success"] = "";
    sessionStorage["flash-error"] = "";

    Axios.interceptors.request.use(request => {
      if (this.state.user.token) {
        request.headers['Authorization'] = "Bearer " + this.state.user.token;
      }
      return request;
    }, (error) => {
      return Promise.reject(error);
    });

    Axios.interceptors.response.use(response => {
      if (response.headers['authorization']) {
        let currentState, appState;
        if (sessionStorage["appState"]) {
          currentState = sessionStorage["appState"];
          appState = JSON.parse(currentState);
          appState.user.token = response.headers['authorization'].split(" ")[1];
          sessionStorage["appState"] = JSON.stringify(appState);
        }
        else if (localStorage["appState"]) {
          currentState = localStorage["appState"];
          appState = JSON.parse(currentState);
          appState.user.token = response.headers['authorization'].split(" ")[1];
          localStorage["appState"] = JSON.stringify(appState);
        }
        this.setState(appState);
      }
      return response;
    }, (error) => {
      if (error.response.status === 401 && error.response.data[0] === "Token Invalid!") {
        let appState = {
          isLoggedIn: false,
          user: {}
        }

        if (sessionStorage["appState"]) {
          sessionStorage["appState"] = JSON.stringify(appState);
        }
        else if (localStorage["appState"]) {
          localStorage["appState"] = JSON.stringify(appState);
        }

        this.setState(appState);
        return redirectOnFailure(this, "/login", "Login Session Expired, Please Log In!", "push");
      }
      return Promise.reject(error);
    });
  }

  loginUser = (email, password, rememberMe) => {
    var formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    Axios
      .post("http://localhost:8000/api/login", formData)
      .then(json => {
        let userData = {
          id: json.data.user.id,
          name: json.data.user.name,
          email: json.data.user.email,
          role: json.data.user.role,
          token: json.data.token,
        };

        let appState = {
          isLoggedIn: true,
          user: userData
        };

        if (!rememberMe) {
          sessionStorage["appState"] = JSON.stringify(appState);
        }
        else {
          localStorage["appState"] = JSON.stringify(appState);
        }

        this.setState(appState);
        return redirectOnSuccess(this, "/users/" + json.data.user.id, "Successfully Logged In!", "push");
      })
      .catch(error => {
        console.log(error);
        return redirectOnFailure(this, this.props.location.pathname, "Login Failed! Please check your credentials!", "replace");
      })
  }

  registerUser = (name, email, password, image, role) => {
    var formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }
    formData.append("role", role);

    Axios
      .post("http://localhost:8000/api/register", formData)
      .then(json => {
        let userData = {
          id: json.data.user.id,
          name: json.data.user.name,
          email: json.data.user.email,
          role: json.data.user.role,
          token: json.data.token
        }

        let appState = {
          isLoggedIn: true,
          user: userData,
        }

        sessionStorage["appState"] = JSON.stringify(appState);
        this.setState(appState);
        return redirectOnSuccess(this, "/", "Successfully Registered!", "push");
      })
      .catch(error => {
        console.log(error);
        return redirectOnFailure(this, this.props.location.pathname, "Login Failed! Please check your credentials!", "replace");
      });
  }

  logoutUser = () => {
    Axios
      .post("http://localhost:8000/api/logout")
      .then(() => {
        let appState = {
          isLoggedIn: false,
          user: {}
        }

        if (sessionStorage["appState"]) {
          sessionStorage["appState"] = JSON.stringify(appState);
        }
        else if (localStorage["appState"]) {
          localStorage["appState"] = JSON.stringify(appState);
        }

        this.setState(appState);
        return redirectOnSuccess(this, this.props.location.pathname, "Successfully Logged Out!", "replace");
      })
      .catch(error => {
        console.log(error);
        return redirectOnFailure(this, this.props.location.pathname, "Logout Failed!", "replace");
      });
  }

  editUser = (name, email, password, role, image, id) => {
    var formData = new FormData();
    if(email){
      formData.append("email", email);
    }
    formData.append("password", password);
    formData.append("name", name);
    formData.append("role", role);
    if (image) {
      formData.append("image", image);
    }
    formData.append('_method', 'PUT');

    Axios({
      method: "post",
      url: "http://localhost:8000/api/users/" + id,
      data: formData,
    })
      .then(json => {
        if (json.data.user.id === this.state.user.id) {
          let userData = {
            id: json.data.user.id,
            name: json.data.user.name,
            email: json.data.user.email,
            role: json.data.user.role,
            token: json.data.token
          }

          let appState = {
            isLoggedIn: true,
            user: userData,
          }

          if (sessionStorage["appState"]) {
            sessionStorage["appState"] = JSON.stringify(appState);
          }
          else if (localStorage["appState"]) {
            localStorage["appState"] = JSON.stringify(appState);
          }

          this.setState(appState);
          return redirectOnSuccess(this, "/", "Successfully Edited Profile!", "push");
        }
        return redirectOnSuccess(this, "/", "Successfully Edited Profile!", "push");
      })
      .catch(error => {
        console.log(error);
        return redirectOnFailure(this, this.props.location.pathname, "Profile Editing Failed! Please Check Your Credentials!", "replace");
      });
  }

  passwordResetLink = (email) => {
    var formData = new FormData();
    formData.append("email", email);
    Axios({
      method: 'post',
      url: 'http://localhost:8000/api/forgot/password',
      data: formData
    })
      .then(response => {
        return redirectOnSuccess(this, "/", "Successfully Sent Reset Email!", "push");
      })
      .catch(error => {
        console.log(error);
        return redirectOnFailure(this, this.props.location.pathname, "Something Went Wrong, Couldn't Send Reset Email!", "replace");
      })
  }

  passwordReset = (email, password, passwordConfirmation, token) => {
    var formData = new FormData();
    formData.append("token", token);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);

    Axios({
      method: 'post',
      url: 'http://localhost:8000/api/reset/password',
      data: formData
    })
      .then(response => {
        return redirectOnSuccess(this, "/login", "Successfully Reset Password!", "push");
      })
      .catch(error => {
        console.log(error);
        return redirectOnFailure(this, "/", "Something Went Wrong, Couldn't Reset Password!", "push");
      })
  }

  createCourseHandler = (title, description, file, image, category, questions, answers) => {
    var formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    if (image) {
      formData.append("image", image);
    }
    formData.append("category", category);
    formData.append("questions", JSON.stringify(questions));
    formData.append("answers", JSON.stringify(answers));

    Axios({
      method: "post",
      url: "http://localhost:8000/api/courses",
      data: formData,
    })
      .then(json => {
        return redirectOnSuccess(this, "/", "Successfully Created Course!", "push");
      })
      .catch(error => {
        console.log(error);
        return redirectOnFailure(this, this.props.location.pathname, "Course Creation Failed, Please Check The Information You Provided!", "replace");
      });
  }

  editCourseHandler = (title, description, file, image, category, id, questions, answers) => {
    var formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }
    if (image) {
      formData.append("image", image);
    }
    formData.append("category", category);
    formData.append("questions", JSON.stringify(questions));
    formData.append("answers", JSON.stringify(answers));
    formData.append('_method', 'PUT');

    Axios({
      method: "post",
      url: "http://localhost:8000/api/courses/" + id,
      data: formData,
    })
      .then(json => {
        return redirectOnSuccess(this, "/", "Successfully Edited Course!", "push");
      })
      .catch(error => {
        console.log(error);
        return redirectOnFailure(this, this.props.location.pathname, "Course Editing Failed!", "reload");
      });
  }

  resultHandler = (id) => {
    Axios({
      method: "post",
      url: "http://localhost:8000/api/courses/" + id + "/subscriptions",
      data: {
        _method: 'PUT'
      },
    })
      .then(json => {
        return redirectOnSuccess(this, "/", "You Have Successfully Passed The Test!", "push");
      })
      .catch(error => {
        return redirectOnFailure(this, "/", "Something Went Wrong, Please Try Again!", "push");
      });
  }

  render() {
    return (
      <ScrollToTop>
        <AuthContext.Provider value={{ isLoggedIn: this.state.isLoggedIn, user: this.state.user }}>
          <Navbar logoutHandler={this.logoutUser} />
          <Switch>
            <Route path="/" exact component={Home} />
            <ProtectedRoute path="/users/:id/edit" exact component={EditProfile} appProps={{ isLoggedIn: this.state.isLoggedIn, userRole: this.state.user.role, authorizedActions: roles, action: 'edit-profile', editUser: this.editUser }} />
            <ProtectedRoute path="/users/:id" exact component={Dashboard} appProps={{ isLoggedIn: this.state.isLoggedIn, userRole: this.state.user.role, authorizedActions: roles, action: 'view-dashboard' }} />
            <ProtectedRoute path="/courses/new" exact component={CreateCourse} appProps={{ isLoggedIn: this.state.isLoggedIn, userRole: this.state.user.role, authorizedActions: roles, action: 'create-course', createCourseHandler: this.createCourseHandler }} />
            <ProtectedRoute path="/courses/:id/edit" exact component={EditCourse} appProps={{ isLoggedIn: this.state.isLoggedIn, userRole: this.state.user.role, authorizedActions: roles, action: 'edit-course', editCourseHandler: this.editCourseHandler }} />
            <ProtectedRoute path="/courses/:id/test" exact component={TestCourse} appProps={{ isLoggedIn: this.state.isLoggedIn, userRole: this.state.user.role, authorizedActions: roles, action: 'pass-test', resultHandler: this.resultHandler }} />
            <Route path="/courses/:category?" exact component={Courses} />
            <UnprotectedRoute path="/login" exact component={Login} appProps={{ isLoggedIn: this.state.isLoggedIn, loginUser: this.loginUser }} />
            <UnprotectedRoute path="/register" exact component={Register} appProps={{ isLoggedIn: this.state.isLoggedIn, registerUser: this.registerUser }} />
            <UnprotectedRoute path="/forgot/password" exact component={ForgotPasswordSend} appProps={{ isLoggedIn: this.state.isLoggedIn, handlePasswordResetLink: this.passwordResetLink }} />
            <UnprotectedRoute path="/reset/password/:token" exact component={ForgotPasswordReset} appProps={{ isLoggedIn: this.state.isLoggedIn, handlePasswordReset: this.passwordReset }} />
          </Switch>
          <Footer />
        </AuthContext.Provider>
      </ScrollToTop>
    );
  }
}

export default withRouter(App);
