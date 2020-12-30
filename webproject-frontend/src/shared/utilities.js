const redirectOnSuccess = function (object, path, message, method) {
    sessionStorage["flash-success"] = message;
    if (method === "replace") {
        object.props.history.replace(path);
    }
    else {
        object.props.history.push(path);
    }
}

const redirectOnFailure = function (object, path, message, method) {
    sessionStorage["flash-error"] = message;
    if (method === "replace") {
        object.props.history.replace(path);
    }
    else {
        object.props.history.push(path);
    }
}

const resetFlashMessages = function () {
    if (sessionStorage["flash-success"]) {
        sessionStorage["flash-success"] = "";
    }
    if (sessionStorage["flash-error"]) {
        sessionStorage["flash-error"] = "";
    }
}

export { redirectOnSuccess, redirectOnFailure, resetFlashMessages }