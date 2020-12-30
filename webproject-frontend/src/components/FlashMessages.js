import React from 'react';

const FlashMessages = (props) => {
    let flashMessageSuccess = null;
    let flashMessageError = null;

    if(sessionStorage["flash-success"]){
      flashMessageSuccess = <div className="alert alert-success container text-center">{sessionStorage["flash-success"]}</div>;
    }
    if(sessionStorage["flash-error"]){
      flashMessageError = <div className="alert alert-danger container text-center">{sessionStorage["flash-error"]}</div>;
    }

    return (
      <React.Fragment>
        {flashMessageSuccess}
        {flashMessageError}
      </React.Fragment>
    );
}

export default FlashMessages;