import React, { useEffect, useState } from 'react';
import Webcam from "react-webcam";
import { RegisterFace } from './helper/exam';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../user/helper/userapicalls';

const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
};

const divStyle={
    height:'300px',
  };


export const WebcamCapture = ({setFaceVerified,courseId}) => {

    const [image,setImage]=useState('');
    const webcamRef = React.useRef(null);
    const navigate = useNavigate();
    const [startExam, setStartExam] = useState(false)
    const {user} = isAuthenticated()

    const capture = React.useCallback(
        async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc)
        const ans = await RegisterFace(imageSrc)
        if(ans.status){
            setFaceVerified(true)
            setStartExam(true)
            localStorage.setItem("mainImage",JSON.stringify(imageSrc))
        }
        });

    return (
        <>

        <div className="container my-4">
                <div className="row justify-content-md-center">
                    <div className="col">
                        <div className="jumbotron text-center">
                            <h1 className="display-4">Hello, {user.name}!</h1>
                            <hr className="my-4"/>
                            <p className="lead">Please capture photo facing straight and with good lighting!</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="conatiner text-center">
            <div className="row justify-content-md-center">
                <div className='col-8'>
                    {image == '' ? <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        minScreenshotHeight={480}
                        minScreenshotWidth={640}
                        width={300}
                        height={300}
                    /> : <img src={image} className='m-4' style={{width:"320px", height:"240px"}}/>}
                </div>
            </div>
            <div className='row justify-content-md-center'>
                {image !== '' ?
                    <button onClick={(e) => {
                        e.preventDefault();
                        setImage('')
                        setStartExam(false)
                        setFaceVerified(false)
                    }}
                        className="btn btn-secondary col-2 m-2">
                        Retake Image</button> :
                    <button onClick={(e) => {
                        e.preventDefault();
                        capture();
                    }}
                        className="btn btn-secondary col-2 m-2">Capture</button>
                }
                    {
                        startExam && (
                            <button onClick={() => navigate(`/exam/${courseId}`)}  className="btn btn-outline-secondary col-2 m-2">Start Exam</button>
                        )
                    }

                    <button onClick={() => navigate(`/course/${courseId}`)}  className="btn btn-secondary col-2 m-2">go back</button>

            </div>
            <div className='row justify-content-md-center m-4'>
                <div className="form-floating col-8">
                    <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={divStyle} disabled={true}></textarea>
                    <label for="floatingTextarea2 ">
                        <h2>Please read below instructions carefully</h2>
                            <ol className='text-start m-2'>
                                <li>We will be using AI system to monitor you while you are taking exam</li>
                                <li>The images which are used while monitoring will not be shared with anyone and it's followed with all ethics</li>
                                <li>Only three attempts are allowed for you to clear the exam</li>
                                <li>Minimum pass percentage is 50</li>
                                <li>Your exam will be auto submitted if you try to switch tabs or if your face is not present infront of camera or if multiple face is detected infront of camera</li>
                                <li>Once you Submit and go to MCQ section do not refresh page becuase it will be considered as you another attempt.</li>
                            </ol>
                    </label>
                </div>
            </div>
        </div>
        </>
    );
};