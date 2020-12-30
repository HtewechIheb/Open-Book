import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const UnprotectedRoute = ({component: Component, appProps, ...rest}) => {
    const isLoggedIn = appProps.isLoggedIn;
    
    return(
        <Route {...rest} render={(props) => !isLoggedIn ? <Component {...props} {...appProps} /> : <Redirect to="/" />}/>
    );
}

export default UnprotectedRoute;