import React,{useEffect, useState} from "react";
import { useNavigate,useParams } from "react-router-dom";
import { isAuthenticated } from "../user/helper/userapicalls";
import { checkIfUserIsEnrolledInExam, getCourse,handlePayment,checkQuestionsAreAvailable } from "./helper/course";
import { getCourseAmountAndTime} from "../Exam/helper/exam";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Base from "../core/base";

const CourseHome = () => {
    let {courseId} = useParams();
    const {user,token} = isAuthenticated();
    const [isEnrolled, setIsEnrolled] = useState(false); 
    const [examAvailable, setExamAvailable] = useState(false)
    const [courseFee, setCourseFee] = useState(0)
    const [courseValues, setCourseValues] = useState({
        name:"",
        description:"",
        image:"",
        category:"",
        error:"",
        success:false
    })

    const notify = (message) => toast(message)

    const {name, description, image} = courseValues

    const preload = async () => {
        const data = await getCourse(user._id,token,courseId)
        if(data.error){
          setCourseValues({...courseValues,error:data.error,success:false})
          notify(data.error)
        }else{
          setCourseValues({
            name: data.name,
            description: data.description,
            image: data.image,
            error: "",
            success: true
          })
          navigate(`/course/${data._id}`)
        }
        
        if(user.role === 0){
            const examAvailablity = await checkQuestionsAreAvailable(courseId,token)
            if(examAvailablity.error){
                notify("Something went wrong while check exam availability")
            }else{
                setExamAvailable(examAvailablity.status)
            }    
        }else{
            setExamAvailable(true)
        }

        const timeAndAmount = await getCourseAmountAndTime(courseId, user._id, token)
        const {amount} = timeAndAmount
        if(data.error){
            notify("Error while getting fee amount")
        }else{
            setCourseFee(amount)
        }
    }

    const checkIfEnrolled = async () => {
        const data = await checkIfUserIsEnrolledInExam(courseId,user._id,token)
        if(data.error){
          setCourseValues({...courseValues,error:data.error,success:false})
          notify(data.error)
        }else{
            if(data.length > 0){
                setIsEnrolled(true)
            }
        }
    }

    useEffect(() => {
        preload()
        user.role === 0 && checkIfEnrolled()
    },[])

    const navigateToExam = async () =>{
        if(user.role === 0){
            if(isEnrolled){
                navigate(`/exam/instructions/${courseId}`)
            }else{
                await handlePayment(courseId,user._id,token,courseFee,setIsEnrolled) 
            }
        }else{
            navigate(`/questions/${courseId}`)
        }
    }

    const getButtonText = () => {
        if(user.role === 0 && isEnrolled){
                return "Take Exam"
        }else if(user.role === 0 && !isEnrolled){
                return "Enroll Exam"
        }

        if(user.role === 1){
            return "Add Exam"
        }
    }

    const navigate = useNavigate()
    return (
        <Base>
            <ToastContainer/>
            <div className="container my-4">
                <div className="row justify-content-md-center">
                    <div className="col">
                        <div className="jumbotron text-center">
                            <h1 className="display-4">{name}!</h1>
                            <p className="lead">{description}</p>
                            <hr className="my-4"/>
                        </div>
                    </div>
                </div>
            </div>

        <div className="card-deck text-center">
        <div className="row justify-content-center mx-atuo">
            <div className="card mx-5"  style={{width:"25rem"}}>
                <img className="rounded mx-auto d-block" src={require('../media/book.png')} alt="Card image cap" style={{height:"200px", width:"200px", objectFit:"contain"}}/>
                <div className="card-body">
                <h5 className="card-title">Resources</h5>
                <p className="card-text">Add content for the course.</p>
                <button className="btn btn-secondary" onClick={() => navigate(`/home/content/${courseId}`)}>Resources</button>
                </div>
            </div>                    

            {examAvailable && (
            <div className="card mx-5" style={{width:"25rem"}}>
                <img className="rounded mx-auto d-block" src={require('../media/exam.png')} alt="Card image cap" style={{height:"200px", width:"200px", objectFit:"contain"}}/>
                <div className="card-body">
                    <h5 className="card-title">Exam</h5>
                    <p className="card-text">Create MCQ exam which is monitored by AI monitoring engine</p>
                <button className="btn btn-secondary" onClick={navigateToExam}>{getButtonText()}</button>
                </div>
            </div>
            )}
        </div>
        </div>
        </Base>
    )
}

export default CourseHome