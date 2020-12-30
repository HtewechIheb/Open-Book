import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({component: Component, appProps, ...rest}) => {
    const userRole = appProps.userRole;
    const action = appProps.action;
    const authorizedActions = appProps.authorizedActions;
    const isLoggedIn = appProps.isLoggedIn;
    
    return(
        <Route {...rest} render={(props) => (isLoggedIn && (authorizedActions[userRole].indexOf(action) !== -1)) ? <Component {...props} {...appProps} /> : <Redirect to={{ pathname: "/", state: { flash: "Unauthorized, You Don't Have Permission To Access This Section!", type: "error" } }} />}/>
    );
}

export default ProtectedRoute;