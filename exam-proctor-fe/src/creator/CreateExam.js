import React, {useEffect, useState} from "react";
import { useParams,useNavigate } from "react-router-dom";
import { isAuthenticated } from "../user/helper/userapicalls";
import { addNewQuestion,editQuestion } from "./helper/course";
import { ToastContainer, toast } from 'react-toastify';

const CreateExam = ({id_,question_, choices_, isEdit,currentQuestion,setReload}) => {

    let {courseId} = useParams();
    let {user, token} = isAuthenticated();
    const navigate = useNavigate()
    const [id,setId] = useState(id_ ? id_ : 0)
    const [quiz,setQuiz] = useState({
        question:question_ ? question_ : "",
        choices:choices_ ? choices_ : [{choice:"", isCorrect:false}],
        error: "",
        success: false
    })

    const notify = (message) => toast(message)

    const {question, choices} = quiz

    useEffect(() => {
        setQuiz({
            ...quiz,
            question:question_ ? question_ : "",
            choices:choices_ ? choices_ : [{choice:"", isCorrect:false}],    
        })
        setId(id_ ? id_ : 0)
    },[currentQuestion])

    const handleQuestion = (event) => {
        setQuiz({
            ...quiz,
            question:event.target.value
        })
    }

    const handleFormChange = (event,index) => {
        let data = [...quiz.choices];
        data[index]["choice"] = event.target.value;
        setQuiz({
            ...quiz,
            choices:data
        });
     }

     const handleAnswer = (event,index) => {
        let data = [...quiz.choices];
        data[index]["isCorrect"] = event.target.checked;
        setQuiz({
            ...quiz,
            choices:data
        });
     }

     const removeFields = (index) => {
        let data = [...quiz.choices];
        data.splice(index, 1)
        setQuiz({
            ...quiz,
            choices:data
        });
    }


    const getChoices = () => {
        return quiz.choices.map((choice, index) => {
            return (
                <div className="input-group mb-3" key={index}>
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                        <input 
                            type="checkbox" 
                            placeholder="Enter choice"
                            onChange={(event) => handleAnswer(event,index)}
                            defaultChecked={false}
                            checked={choice.isCorrect}
                            className="m-2"
                            />
                        </div>
                    </div>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter choice" 
                        aria-label="Text input with checkbox"
                        value={choice.choice} 
                        onChange={(event) => handleFormChange(event,index)}
                    />
                    <button type="button" className="btn btn-warning" onClick={() => removeFields(index)}>Remove</button>
                </div>
            )
        })
    }

    const addAnotherQuestion = async (event) => {
        event.preventDefault()
        const choicesData = choices.filter(choice => choice.choice !== "").map(choice => choice.choice) 
        const answersData = choices.filter(choice => choice.choice !== "" && choice.isCorrect).map(choice => choice.choice)
        const answerType = answersData.length === 1 ? "single" : "multiple"

        if (isEdit){
        const data = await editQuestion(user._id,token,courseId,{
            id,
            question,
            choices:choicesData,
            answers:answersData,
            answerType
        })
            if(data.error){
                notify("Something went wrong while editing")
            }else{
                notify("Question edited successfully")
                setReload(prevstate => prevstate + 1)
            }
        }else{
        const data = await addNewQuestion(user._id,token,courseId,{
            question,
            choices:choicesData,
            answers:answersData,
            course: courseId,
            answerType,
            createdBy: user._id
        })
          if(data.error){
            setQuiz({...quiz,error:data.error,success:false})
            notify("Something went wrong while adding")
          }else{
            setQuiz({
            question:"",
            choices:[{
                choice:"",
                isCorrect:false
            }],
            error: "",
            success: true
            })
          }
          setReload(prevstate => prevstate + 1)
          notify("Question added successfully")
        }
    }


    const addChoices = () => {
        setQuiz({
            ...quiz,
            choices:[...quiz.choices,{choice:"",isCorrect:false}]
        })
    }

    return (
        <div className="my-2">
            <ToastContainer/>
            <div className="input-group mb-3">
            <input 
                type="text" 
                className="form-control" 
                placeholder="Enter question" 
                aria-describedby="basic-addon2"
                value={question}
                onChange={handleQuestion}
            />
            <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button" onClick={addChoices}>Add options</button>
            </div>
            </div>
            {getChoices()}
            <button type="button" className="btn btn-secondary m-2" onClick={addAnotherQuestion}>{isEdit ? "Edit" : "Add"}</button>
            <button type="button" className="btn btn-secondary m-2" onClick={() => navigate(`/course/${courseId}`)}>go back</button>
        </div>
    )
}

export default CreateExam