import React, { useState } from 'react'
import { WebcamCapture} from './webcamCapture'
import { useNavigate,useParams } from 'react-router-dom';

const InitiateExam = () => {

    const {courseId} = useParams();
    const [faceVerified, setFaceVerified] = useState(false)
    
    return (
        <div className="home-container">
            <div className="container">
                <div className="text">
                    <WebcamCapture setFaceVerified={setFaceVerified} courseId={courseId}/>
                </div>
            </div>
        </div>
    )
}

export default InitiateExam
