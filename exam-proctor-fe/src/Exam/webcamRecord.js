import React, { useEffect, useState } from 'react';
import Webcam from "react-webcam";
import { AnalyseFace } from './helper/exam';

const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
};

export const WebcamRecord = ({setAnalyseFaceResult}) => {

    const webcamRef = React.useRef(null);

    useEffect(() => {
        async function captureImageAndAnalyse() {
            const mainBase64Image = localStorage.getItem('mainImage').slice(1, -1);
            const currentImage = webcamRef.current.getScreenshot() 
            if(mainBase64Image && currentImage){
                const response = await AnalyseFace(mainBase64Image, currentImage);
                console.log(response)                
                setAnalyseFaceResult({
                    status:response.status,
                    failedMessages:response.message
                })
            }
        }
        captureImageAndAnalyse()
        const interval = setInterval(() => captureImageAndAnalyse(), 1000)
        return () => {
          clearInterval(interval);
        }
    }, [])    
    return (
        <div className="webcam-container">
            <div className="webcam-img">
            <Webcam
                audio={false}
                height={300}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={300}
                videoConstraints={videoConstraints}
                minScreenshotWidth={640}
                minScreenshotHeight={480}
            />
            </div>
        </div>
    );
};