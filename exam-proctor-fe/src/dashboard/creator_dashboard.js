import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Base from "../core/base";
import { isAuthenticated } from "../user/helper/userapicalls";
import { getCourseByCreatorId } from "./helper/dashboardapicalls";
import { ToastContainer, toast } from 'react-toastify';

const CreatorDashboard = () => {
    const [values,setValues] = useState([])
    const navigate = useNavigate()
    const {user, token} = isAuthenticated()

    const defaultImage = 'https://img.favpng.com/23/7/4/computer-icons-educational-technology-learning-training-course-png-favpng-j5t2UTpdMx23LZhscuTVqAJGb.jpg'

    const preload = () => {
        getCourseByCreatorId(user._id,token).then(data => {
          if(data.error) {
            setValues({...values, error: data.error})
            notify(data.error)
          }else{
            setValues(data.map(course => {
              return {
                  id: course._id, 
                  title: course.name, 
                  desciption: course.description, 
                  image: course.image === "" ? defaultImage : course.image,
                  updatedAt: course.updatedAt
                }
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
            <div className="card mx-5 my-2" style={{width:"25rem"}}>
                <img className="rounded mx-auto d-block" src={course.image} alt="Card image cap" style={{height:"200px", width:"200px", objectFit:"contain"}}/>
                <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.desciption}</p>
                <button className="btn btn-secondary" onClick={() => navigate(`/course/${course.id}`)}>Go to course</button>
                </div>
                <div className="card-footer">
                <small className="text-muted">Last updated {course.updatedAt}</small>
                </div>
            </div>
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
                            <p className="lead">Create amazing courses which will impact millions of people!</p>
                            <p className="lead">
                                <button className="btn btn-secondary btn-lg btn-block" onClick={() => navigate("/create/course")}>Add course</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-deck">
                <div className="row justify-content-md-center">
                    {getAllCourses()}
                </div>
            </div>

        </Base>
    )
}

export default CreatorDashboard