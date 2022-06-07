import React,{useEffect,useState} from "react";
import { useNavigate,useParams } from "react-router-dom";
import { isAuthenticated } from "../user/helper/userapicalls";
import { getExamQuestions,submitExam,getCourseAmountAndTime,checkExamFrequency } from "./helper/exam"
import Modal from 'react-modal';
import { usePageVisibility } from 'react-page-visibility';
import { ToastContainer, toast } from 'react-toastify';
import { useTimer } from 'react-timer-hook';
import { WebcamRecord } from "./webcamRecord";

import 'react-toastify/dist/ReactToastify.css';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

Modal.setAppElement('#root');

function MyTimer({ expiryTimestamp,setActive }) {
    const {
      seconds,
      minutes,
      hours,
      isRunning
    } = useTimer({
      expiryTimestamp,
      onExpire: () => {
        setActive(false)
        }
    });
  
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "50px" }}>
          <span>{hours}</span>:<span>{minutes}</span>:
          <span>{seconds}</span>
        </div>
      </div>
    );
  }

const Exam = () => {

    const navigate = useNavigate()

    const isVisible = usePageVisibility()

    const [isPass, setIsPass] = useState(false)
    const [killExam, setKillExam] = useState(false)
    const [render, setRender] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState(true)
    const [currentFrame, setCurrentFrame] = useState('')
    const [examTime, setExamTime] = useState(0)
    const [canAttemptExam, setCanAttemptExam] = useState(1)

    const notify = (message) => toast(message)

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    
    const [values, setValues] = useState([])
    const [userSubmitted, isUserSubmitted] = useState(false)
    const [attemptLeft,setAttemptLeft] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const {user,token} = isAuthenticated()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [analyseFaceResult, setAnalyseFaceResult] = useState({
        status: true,
        failedMessages: []
    })
    const [score, setScore] = useState(0)

    let {courseId} = useParams();

    const preload = async () => {
        const data = await getExamQuestions(courseId, user._id, token)

        if(data.error) {
            setCanAttemptExam(false)
            notify(data.error)
        }else{
            setValues(data.map(questionDetails => {
            const {_id,question,answerType} = questionDetails
            const choices = questionDetails.choices.map(choice => { return {choice: choice,selected: false} })
            return {
                id:_id,
                question,
                answerType,
                choices
            }
            }))
            }
        
        const timeAndAmount = await getCourseAmountAndTime(courseId, user._id, token)
        const {time} = timeAndAmount
        if(data.error){
            notify("Error while getting time")
        }else{
            setExamTime(time)
        }

        const attempts = await checkExamFrequency(courseId, user._id, token)
        const {status,message} = attempts
        if(status){
            setCanAttemptExam(status)
        }else{
            setCanAttemptExam(status)
            notify(message)
        }
    
    }

    useEffect(() => {
        preload()
    },[])

    useEffect(() => {
        
    })

    const nextQuestion = () => {
        if (values.length - 1 != currentQuestion){
           setCurrentQuestion(currentQuestion + 1)
        }
    }

    const prevQuestion = () => {
        if (currentQuestion > 0){
            setCurrentQuestion(currentQuestion - 1)
        }
    }


    const constructChoices = (choices) => {
        return choices.map((choice,index) => (
            <button key={index} className={`${choice.selected ? "btn btn-secondary btn-lg" : "btn btn-outline-secondary btn-sm"}`} value={choice.selected} onClick={(event) => selectAnswers(event,index)}>{choice.choice}</button>
        ))
    }

    const selectAnswers = (event,index) => {
        event.preventDefault()
        let tempValues = values
        tempValues[currentQuestion].choices[index]["selected"] = !tempValues[currentQuestion].choices[index]["selected"]

        if (values[currentQuestion].answerType === 'single'){
            tempValues[currentQuestion].choices = tempValues[currentQuestion].choices.map((choice,_index) => {
                if(index !== _index){
                    return {...choice, selected: false}
                }else{
                    return {...choice}
                }
            })             
        }
        
        setValues([
            ...tempValues
        ])
    }

    const submitAnswer = async () => {
        const submittedAnswers = values.map(value => {
            return {
                id:value.id,
                choices: value.choices.filter(choice => choice.selected).map(choice => choice.choice)
            }
        })
        const data = await submitExam(user._id,token,courseId,submittedAnswers)
        if(data.error){
          notify("Something went wrong while submitting exam")
        }else{
            notify(data.message)
            setScore(data.score)
            setIsPass(data.isPass)
            setIsSubmitted(true)
            setAttemptLeft(data.attemptLeft)
        }

        closeModal()
    }

    if(!isVisible && !render && !isSubmitted){
        setRender(true)
        setKillExam(true)

        !isSubmitted && submitAnswer()
    }
    
    if(!active && !isSubmitted){
        !isSubmitted && submitAnswer()
    }

    if(!analyseFaceResult.status){
        !isSubmitted && submitAnswer()
    }

    const submitAnswerByClicking = async () => {
        !isSubmitted && await submitAnswer()
        isUserSubmitted(true)
    }

    const value = values[currentQuestion]    

    const time = new Date();
    time.setSeconds(time.getSeconds() + examTime);

return(
    <div className="container">
        <ToastContainer />
        {(value && examTime !== 0 && !killExam && active && !isSubmitted && analyseFaceResult.status) && (
            <>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
            <div className="container-sm">
                <h3>Make sure you have attended all the questions</h3>
                <button className="btn btn-default m-2" onClick={closeModal}>close</button>
                <button className="btn btn-secondary m-2" onClick={submitAnswerByClicking}>Submit</button>
            </div>
            </Modal>        
            <MyTimer expiryTimestamp={time} setActive={setActive}/>

            <div className="container my-4">
                <div className="row justify-content-md-center">
                    <div className="col">
                        <div className="jumbotron text-center">
                            <hr className="my-4"/>
                            <p className="lead">Do not refresh/navigate to other pages!</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid" key={value.id}>
            <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <h1 className="text">{value.question}<button className="mx-4" disabled={true} variant="secondary" >{value.answerType}</button></h1>
                </div>
                <div className="col-2 mx-auto">
                    <button className="btn btn-secondary" onClick={openModal}>Submit Exam</button>
                </div>
            </div>
                <div className="d-grid gap-2">
                    {constructChoices(value.choices)}
                </div>
            </div>
        </div>

        <div className="container p-4">
        <div className="row">
            <div className="col-sm-12 text-center line">
                <button className="btn btn-default m-2" onClick={prevQuestion}>prev</button>
                <button className="btn btn-success m-2" onClick={nextQuestion}>next</button>
            </div>
        </div>
        </div>
        <div className="row justify-content-md-end">
            <div className="col">
                <WebcamRecord setCurrentFrame={setCurrentFrame} currentFrame={currentFrame} setAnalyseFaceResult={setAnalyseFaceResult}/>
            </div>
        </div>
        </>
        )}

        {isSubmitted && canAttemptExam &&(
        <>
            {killExam && values.length !== 0 && navigate(`/result/${courseId}/${user._id}`,{state:{reason:`Switched tabs.`, isPass:isPass, score:score, attemptLeft:attemptLeft, user:user, courseId:courseId, token:token}},{ replace: true })}
            {!active && values.length !== 0 && navigate(`/result/${courseId}/${user._id}`,{state:{reason:`Time out.`, isPass:isPass, score:score, attemptLeft:attemptLeft, user:user, courseId:courseId, token:token}},{ replace: true })}
            {userSubmitted && values.length !== 0 && navigate(`/result/${courseId}/${user._id}`,{state:{reason:`User submittion.`, isPass:isPass, score:score, attemptLeft:attemptLeft, user:user, courseId:courseId, token:token}},{ replace: true })}
            {!analyseFaceResult.status && values.length !== 0 && navigate(`/result/${courseId}/${user._id}`,{state:{reason:`Exam ended becuase your face analysis failed.`, isPass:isPass, score:score, attemptLeft:attemptLeft, user:user, courseId:courseId, token:token}},{ replace: true })}
            {values.length === 0 && navigate(`/result/${courseId}/${user._id}`,{state:{reason:`Exam ended becuase your face analysis failed.`, isPass:isPass, score:score, attemptLeft:attemptLeft, user:user, courseId:courseId, token:token,maxLimit:true}},{ replace: true })}
        </>
        )}

        {!canAttemptExam && navigate("/exam/error/multiattempt")}


    </div>
    
)

}
export default Exam