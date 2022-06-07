import React from "react";
import { isAuthenticated } from "../user/helper/userapicalls";
import { useNavigate } from "react-router-dom";

const MultipleAttemptError = () => {

    const navigate = useNavigate()
    const {user} = isAuthenticated()

    return (
        <div className="container my-4">
        <div className="row justify-content-md-center">
            <div className="col">
                <div className="jumbotron text-center">
                    <h1 className="display-4">Hello, {user.name}!</h1>
                    <hr className="my-4"/>
                    <p className="lead">You have reached maximum re attempts to this exam</p>
                    <p className="lead">
                        <button className="btn btn-secondary btn-lg btn-block" onClick={() => navigate("/dashboard/learner")}>Go back</button>
                    </p>
                </div>
            </div>
        </div>
    </div>        
    )
}

export default MultipleAttemptError