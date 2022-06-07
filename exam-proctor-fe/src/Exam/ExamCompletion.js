import React,{useEffect,useState} from "react";
import { checkIfUserIsEnrolledInExam } from "../creator/helper/course";
import { API } from "../backend";
import { useLocation } from "react-router-dom";
import Base from "../core/base";
import { ToastContainer, toast } from 'react-toastify';

const ExamCompletion = () => {

    const [pass,setPass] = useState(false)
    const notify = (message) => toast(message)

    const location = useLocation();
    const {reason,maxLimit,score,isPass,attemptLeft,user,courseId,token} = location.state

    let bodyContent = ""
    if (maxLimit){
        bodyContent = "You have reached the maximum amount of re attempts"
    }else if(isPass){
        bodyContent = "Congrats you have cleared Exam"
    }else{
        if(attemptLeft === 0){
            bodyContent = "Sorry you have not meet the bench mark."
        }else{
            bodyContent = "Sorry you have not meet the bench mark. Please try again"
        }
    }

    const checkIfEnrolled = async () => {
        const data = await checkIfUserIsEnrolledInExam(courseId,user._id,token)
        if(data.error){
          notify(data.error)
        }else{
            if(data.length > 0){
                if(data[0].pass){
                    setPass(true)
                }
            }
        }
    }

    useEffect(() => {
        checkIfEnrolled()
    },[])

    return (
        <Base>
            <ToastContainer/>
            <div className="container">
            <div className="container my-4">
                    <div className="row justify-content-md-center">
                        <div className="col">
                            <div className="jumbotron text-center">
                                <h1 className="display-4">Hello, {user.name}!</h1>
                                <hr className="my-4"/>
                                <p className="lead">{bodyContent}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-md-center mt-4">
                            <div className="col text-center">
                                <h3>Score <span>(Best of all attempts)</span>: {score}
                                </h3>{reason && <p>Exam submitted reason: {reason}</p>}
                                <p>Attempts left : {attemptLeft}</p>
                                {
                                    pass && (
                                        <p className="lead">
                                        <a className="btn btn-secondary btn-lg" href={`${API}/certificate/${courseId}/${user._id}`} target="_blank" role="button" >Download certificate</a>
                                    </p>    
                                    )
                                }
                            </div>
                        </div>
                </div>
            </div>
        </Base>
    )
}

export default ExamCompletion