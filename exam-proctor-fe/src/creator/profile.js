import React,{useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import { isAuthenticated } from "../user/helper/userapicalls";
import Base from "../core/base";
import { creatorProfileDetails } from "./helper/course";

const CreatorProfile = () => {

    const {user,token} = isAuthenticated()
    const [values,setValues] = useState([])

    const notify = (message) => toast(message)

    const preload = async () => {
        creatorProfileDetails(user._id,token).then(data => {
            if(data.error) {
                notify("Error while getting created courses")
            }else{
                console.log(data)
                setValues(data.map(value => {
                const defaultImage = 'https://img.favpng.com/23/7/4/computer-icons-educational-technology-learning-training-course-png-favpng-j5t2UTpdMx23LZhscuTVqAJGb.jpg'
                const {image, updatedAt,name,_id} = value._id
                return {courseId:_id, name: name, image: image === "" ? defaultImage : image, numberOfEnollment:value.count, lastUpdated: updatedAt}
              }))
            }
          })
    }

    useState(() => {
        preload()
    },[])

    const getAllCourses = () => {
        return values.map(course => {
         return (

            <>
            <div className="card mx-5 my-5" style={{width:"25rem"}}>
                <img className="rounded mx-auto d-block" src={course.image} alt="Card image cap" style={{height:"200px", width:"200px", objectFit:"contain"}}/>
                <div className="card-body">
                <h5 className="card-title">{course.name}</h5>
                <p className="card-text">No of enrollment: <strong>{course.numberOfEnollment}</strong></p>
                </div>
                <div className="card-footer">
                <small className="text-muted">Last updated {course.lastUpdated}</small>
                </div>
            </div>

            </>
         )   
        })
    }

    return (
        <>
        <Base>
        <ToastContainer/>

        <div className="container my-4">
                <div className="row justify-content-md-center">
                    <div className="col">
                        <div className="jumbotron text-center">
                            <h1 className="display-4">Hello, {user.name}!</h1>
                            <hr className="my-4"/>
                            <p className="lead">You courses are going to educate millions of people.</p>
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
        </>
    )
}

export default CreatorProfile
