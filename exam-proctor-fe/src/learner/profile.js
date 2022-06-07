import React, { useEffect, useState } from "react";
import Base from "../core/base"
import { isAuthenticated } from "../user/helper/userapicalls";
import { learnerProfileDetails } from "./helper/learner";
import { ToastContainer, toast } from 'react-toastify';
import { API } from "../backend";

const LearnerProfile = () => {

    const {user,token} = isAuthenticated()
    const [values,setValues] = useState([])

    const preload = () => {
        learnerProfileDetails(user._id,token).then(data => {
            if(data.error) {
                notify("Error while getting enrolled courses")
            }else{
                setValues(data.map(value => {
                const defaultImage = 'https://img.favpng.com/23/7/4/computer-icons-educational-technology-learning-training-course-png-favpng-j5t2UTpdMx23LZhscuTVqAJGb.jpg'
                return {courseId:value.course._id, name: value.course.name, image: value.course.image === "" ? defaultImage : value.course.image, pass:value.pass, score:value.score, download: value.pass}
              }))
            }
          })
  
    }

    const notify = (message) => toast(message)

    useEffect(() => {
        preload()
    },[])

    const getAllCourses = () => {
        return values.map(course => {
         return (
            <>
            <div className="card mx-5 my-3" style={{width:"25rem"}}>
                <img className="rounded mx-auto d-block" src={course.image} alt="Card image cap" style={{height:"200px", width:"200px", objectFit:"contain"}}/>
                <div className="card-body">
                <h5 className="card-title">{course.name}</h5>
                <p className="card-text">Score: <strong>{course.score}</strong></p>
                <p className="card-text">Result: <strong>{course.pass ? "Pass" : "Fail"}</strong></p>
                {course.pass && (
                        <a className="btn btn-secondary btn-lg" href={`${API}/certificate/${course.courseId}/${user._id}`} target="_blank" role="button" >Download certificate</a>
                    )}
                </div>
            </div>
            </>
         )   
        })
    }

    return (
        <Base>
            <ToastContainer/>
            <div className="container my-4">
                <div className="row justify-content-md-center">
                    <div className="col">
                        <div className="jumbotron text-center">
                            <h1 className="display-4">Hello, {user.name}!</h1>
                            <hr className="my-4"/>
                            <p className="lead">You are doing a great job</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-deck my-4">
                <div className="row justify-content-md-center">
                    {getAllCourses()}
                </div>
            </div>
        </Base>
    )
}

export default LearnerProfile