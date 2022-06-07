import React,{useState,useEffect, useDebugValue} from "react";
import { useNavigate,useParams } from "react-router-dom";
import { isAuthenticated } from "../user/helper/userapicalls";
import { getContentsByCouseId,deleteByContentId } from "./helper/courseContent";
import { ToastContainer, toast } from 'react-toastify';


const ContentHome = () => {
    const navigate = useNavigate()
    const {user,token} = isAuthenticated()
    const [reload,setReload] = useState(0)
    let {courseId} = useParams();
    const [values, setValues] = useState([])

    const isCreator = user.role === 1

    const notify = (message) => toast(message)

    useEffect(() => {
        preload()
    },[reload])


    const preload = async () => {
        const data = await getContentsByCouseId(courseId,user._id,token)
        if(data.error){
          notify("Error while fteching contents")
        }else{
            setValues(data.map(content => {
                return {
                    id: content._id,
                    title: content.title,
                    filename: content.filename
                }
            }))
        }
    }

    const deleteContent = async (id) => {
        const data = await deleteByContentId(id,user._id,token)
        console.log(data)
        if(data.error || !data.status){
            notify("Something went wrong while deleting")
        }else{
            setReload(reload + 1)
            console.log(reload)
            notify("Deleted successfully")
        }
    }


    const GetAllContent = () => values.map((content,index) => {
         return (
            <div className="card col-xs-4 col-xs-4 m-4" key={index}>
                <div className="card-body">
                    <h2 className="card-title">{content.title}</h2>
                    <button className="btn btn-secondary m-2" onClick={() => navigate(`/sample/${content.id}`,{state:{courseId:courseId}})}>Content</button>
                    {isCreator && (
                    <>
                        <button className="btn btn-secondary m-2" onClick={() => navigate(`/edit/${content.id}`,{state:{courseId:courseId}})}>Edit content</button>
                        <button className="btn btn-secondary m-2" onClick={() => deleteContent(content.id)}>Delete content</button>
                    </>
                    )}
                </div>
            </div>
         )   
        })

    return (
        <>
            <ToastContainer />
            {
                isCreator ? (
                    <>
                    <div className="container my-4">
                        <div className="row justify-content-md-center">
                            <div className="col">
                                <div className="jumbotron text-center">
                                    <h1 className="display-4">Content</h1>
                                    <hr className="my-4"/>
                                    <p className="lead">Add content using rich interactive text</p>
                                    <div className="row justify-content-md-center">
                                        <div className="col-2">
                                        <p className="lead">
                                            <button className="btn btn-secondary btn-lg btn-block" onClick={() => navigate(`/create/content/${courseId}`)}>Add course</button>
                                        </p>                                            
                                        </div>
                                        <div className="col-2">
                                        <p className="lead">
                                            <button className="btn btn-secondary btn-lg btn-block" onClick={() => navigate(`/course/${courseId}`)}>Go back</button>
                                        </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </>    
                ) : (
                    <>
                    <div className="container my-4">
                        <div className="row justify-content-md-center">
                            <div className="col">
                                <div className="jumbotron text-center">
                                    <h1 className="display-4">Content</h1>
                                    <hr className="my-4"/>
                                    <p className="lead">Reading is the best learning!</p>
                                    <div className="row justify-content-md-center">
                                        <div className="col-2">
                                        <p className="lead">
                                            <button className="btn btn-secondary btn-lg btn-block" onClick={() => navigate(`/course/${courseId}`)}>Go back</button>
                                        </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>                    
                )
            }
            {values.length > 0 && (
                <>{GetAllContent()}</>
            )}
        </>
    )
}

export default ContentHome