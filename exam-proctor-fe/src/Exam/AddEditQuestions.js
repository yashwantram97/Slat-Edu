import React,{useEffect,useState} from "react";
import { getQuestionsByCourseId,getCourseAmountAndTime,editExamTimeApi } from "./helper/exam";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { isAuthenticated } from "../user/helper/userapicalls";
import CreateExam from "../creator/CreateExam";

const AddEditQuestions = () => {

    const [values,setValues] = useState([])
    const [reload, setReload] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [examTime,setExamTime] = useState(0)
    const {user,token} = isAuthenticated()

    const {courseId} = useParams()

    const notify = (message) => toast(message)

    const divStyle={
        overflowY: 'scroll',
        height:'500px',
        position:'relative',
      };

    const checkIfSelected = async (element,list_) => {
        if (list_.length > 0){
            return list_.includes(element)
        }else{
            return false
        }
    }

    const editExamTimeApiCall = async () => {
        const data = await editExamTimeApi(user._id,token,courseId,{examTime})
        if(data.error){
            notify(data.error)
        }else{
            notify("Time edited successfully")
        }
    }

    const preload = async () => {
        const data = await getQuestionsByCourseId(courseId, user._id, token)

        if(data.error) {
            notify("Error while getting questions")
        }else{
            const questions = await Promise.all(data.map(async question => {
                const choices = await Promise.all(question.choices.map(async choice => await checkIfSelected(choice, question.answers) ? {choice: choice, isCorrect:true} : {choice: choice, isCorrect:false}))   
                return {
                    id:question._id,
                    question:question.question,
                    choices
                }  
            })
            )
            setValues(questions)
            setExamTime(data.examTimeLimit ? data.examTimeLimit : 0)
            setCurrentQuestion(values.length === 0 ? -1 : 0)
        }

        const timeAndAmount = await getCourseAmountAndTime(courseId, user._id, token)
        const {time} = timeAndAmount
        if(data.error){
            notify("Error while getting time")
        }else{
            setExamTime(time)
        }

    }

    useEffect(() => {
        preload()
    },[reload])

    const getAllQuestion = () => {
        return values.map((question,index) => (
            <div className="row justify-content-md-center mx-2" key={index}>
                    <button 
                        type="button" 
                        className="col-4 my-2 form-control btn btn-secondary btn-lg btn-block"
                        onClick={() => setCurrentQuestion(index)}
                    >{question.question}</button>
            </div>
        ))
    }

    const getCreateExam = () => (
        currentQuestion === -1 || values.length === 0?
        <CreateExam 
            isEdit={false}
            setReload={setReload}
        />
        :
        <CreateExam 
        question_={values[currentQuestion].question} 
        choices_={values[currentQuestion].choices}
        isEdit={true}
        currentQuestion={currentQuestion}
        id_={values[currentQuestion].id}
        setReload={setReload}
    />

    )

    const editExamTime = () => (
        <div className="container">
            <div className="row">
                <div className="col-10 mx-auto">
                <p className="lead">Change exam timing (In secs)</p>
                <div className="input-group mb-3">
                    <input type="number" className="form-control" placeholder="In secs" aria-label="Recipient's username" aria-describedby="basic-addon2" value={examTime} onChange={(e) => setExamTime(e.target.value)}/>
                    <div className="input-group-append">
                        <button className="btn btn-secondary" type="button" onClick={editExamTimeApiCall}>change</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <>  
            <ToastContainer/>
            <div className="container my-4">
                <div className="row justify-content-md-center">
                    <div className="col">
                        <div className="jumbotron text-center">
                            <h1 className="display-4">Add questions</h1>
                            <hr className="my-4"/>
                            <p className="lead">You can create multiple choice questions here</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* {editExamTime()} */}
            {values.length > 0 ? (
            <div className="container">
                    <div className="row mx-auto">
                        <div className="col-sm-4" style={divStyle}>
                            <div className="row mx-2">
                                    <button 
                                        type="button" 
                                        className="col-4 my-2 form-control btn btn-secondary btn-lg btn-block"
                                        onClick={() => setCurrentQuestion(-1)}
                                    >Add new question</button>
                            </div>
                            {getAllQuestion()}
                        </div>
                        <div className="col-sm-8">
                            {getCreateExam()}
                        </div>
                    </div>
                    <hr className="my-4"/>
            </div>
            ): (
                <div className="container">
                    <div className="row mx-auto">
                        <div className="col-sm-4" style={divStyle}>
                            <div className="row mx-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary btn-lg btn-block"
                                        onClick={() => setCurrentQuestion(-1)}
                                    >Add new question</button>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            {getCreateExam()}
                        </div>
                    </div>
                    <hr className="my-4"/>
                </div>
            )}
            {editExamTime()}
        </>
    )
}

export default AddEditQuestions