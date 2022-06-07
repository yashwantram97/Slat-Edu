const axios = require('axios').default;

exports.detectFaces = async (req,res) => {

    const headers = {
        'Content-Type': 'application/json'
    }

    postData = {
        img: req.body.img.toString()
    }

    const response = await axios.post(`${process.env.API}/register/face`,postData, {
                        headers: headers
                        })
                    .then(reponse => {

                    if(reponse.data.face_count === 1 && reponse.data.pose == "Forward"){
                        return res.status(200).json({
                            status: true,
                            message: "Face verified"
                        })
                    }
                    
                    let errorMessage = ''

                    if(reponse.data.face_count == 0){
                        errorMessage = "There is no person detected infront of system"
                        return res.status(200).json({
                            status: false,
                            message: errorMessage
                        })
                    }

                    if(reponse.data.face_count > 1){
                        errorMessage = "Only one person should take exam"
                        return res.status(200).json({
                            status: false,
                            message: errorMessage
                        })
                    }

                    if(reponse.data.pose != "Forward")
                        errorMessage = "Please look only into computer while taking the exam"
                        return res.status(200).json({
                            status: false,
                            message: errorMessage
                        })
                    })
                    .catch(err => console.log(err));
    
}

exports.analyseFace = async (req,res) => {
    const headers = {
        'Content-Type': 'application/json'
    }

    postData = {
        model_name:"VGG-Face",
        img:[{
            img1: req.body.img1.toString(),
            img2: req.body.img2.toString()    
        }]
    }

    const response = axios.post(`${process.env.API}/analyse/face`,postData, {
        headers: headers
        })
        .then(reponse => {

        console.log(reponse.data)
        const res_ = {
            status:"",
            face_verfication:false,
            pose: {
                status: false,
                message: ""
            },
            face_count:0
        }

        if(reponse.data.face_count === 1 && reponse.data.face_verification.pair_1.verified){
            // return res.status(200).json({
            //     status: true,
            //     message: "Verified"
            // })
            res_["status"]= true
            res_["face_count"] = reponse.data.face_count
            res_["face_verfication"] = true
            if (reponse.data.pose === "Forward"){
                res_["pose"] = {
                    status: true,
                    message: ""
                }
            }else{
                res_["pose"] = {
                    status: true,
                    message: "Please look straight into questions"
                }
            }
            res_["message"] = ["Face Analysed"]
        }else{
            res_["status"]= false
            res_["face_count"] = reponse.data.face_count
            res_["face_verfication"] = reponse.data.face_verification.pair_1.verified
            if (reponse.data.pose === "Forward"){
                res_["pose"] = {
                    status: true,
                    message: ""
                }
            }else{
                res_["pose"] = {
                    status: true,
                    message: "Please look straight into questions"
                }
            }

            res_["message"] = []
            if(reponse.data.face_count === 0){
                res_["message"].push("No face found infront of exam")
            }

            if(reponse.data.face_count > 1){
                res_["message"].push("Multiple people found infront of exam")
            }

            if(!reponse.data.face_verification.pair_1.verified){
                res_["message"].push("Face verification failed")
            }

        }
    
    return res.json(res_)
    })
    .catch((err) => {
        console.log("ERROR=>",err)
    })


}