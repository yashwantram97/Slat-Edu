import React, { useEffect,useState } from "react";
import { Markup } from 'interweave';
import {useParams,useLocation,useNavigate} from 'react-router-dom';
import { getContentByContentId } from "./helper/courseContent";
import { isAuthenticated } from "../user/helper/userapicalls";
import { ToastContainer, toast } from 'react-toastify';

const SampleShow = () => {

    let {contentId} = useParams();
    const {token} = isAuthenticated()
    const location = useLocation();
    const {courseId} = location.state
    const [values, setValues] = useState({
        status:false,
        htmlString:"",
        error:"",
        title:"Title"
    })
    const navigate = useNavigate()

    const divStyle={
        overflowY: 'scroll',
        height:'700px',
        position:'relative'
      };
    
    const preload = async () => {
        const data = await getContentByContentId(contentId,token)
        if(data.error){
            setValues({...values,status:false,error:data.error})
            notify(data.error)
        }else{
            setValues({...values,status:true,htmlString:data.string,title:data.title})
        }
    }

    const notify = (message) => toast(message)

    useEffect(() => {
        preload()
    },[])
    
    return (
        
        <div className="container">

            <div className="container my-4">
                <div className="row justify-content-md-center">
                    <div className="col">
                        <div className="jumbotron text-center">
                            <h1 className="display-4">{values.title}</h1>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col-12 mx-auto border border-secondary rounded" >
                    <div style={divStyle}>
                        {values.status && (<Markup content={values.htmlString} />)}                    
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-2 mx-auto m-2">
                    <button className="btn btn-secondary form-control" onClick={() => navigate(`/home/content/${courseId}`)}>Go back</button>
                </div>
            </div>
        </div>
        )
}

export default SampleShow