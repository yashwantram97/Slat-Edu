import React, { useState } from 'react';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Link, useNavigate,useParams } from 'react-router-dom';
import { createCourseContent } from './helper/courseContent';
import { ToastContainer, toast } from 'react-toastify';
import { isAuthenticated } from '../user/helper/userapicalls';

const AddnewContent = () => {

    const [editorState,setEditorState] =useState(EditorState.createEmpty()) 
    const [title,setTitle] = useState("")
    const [values,setValues] = useState({
        contentId:"",
        error:"",
        success:false
    })
    const {token} = isAuthenticated()
    let {courseId} = useParams();
    const navigate = useNavigate();

    const divStyle={
        overflowY: 'scroll',
        height:'700px',
        position:'relative'
      };

    const notify = (message) => toast(message)

    const onSubmit = async event => {
        event.preventDefault()
        const data = await createCourseContent(courseId,token,{title,htmlString:draftToHtml(convertToRaw(editorState.getCurrentContent()))})
          if(data.error){
            setValues({...values,error:data.error,success:false})
            notify(data.error)
          }else{
            setValues({
            contentId:data.id,
            error: "",
            success: true
            })
            notify("Content added successfully")
            navigate(`/home/content/${courseId}`)
          }
      }

    
    return (
        <>
            <ToastContainer />
            <div className="container">
            <div className="row">
                <div className="col-10 m-2 mx-auto">
                <div className="input-group">
                    <div className="input-group-prepend mx-2">
                        <span className="input-group-text border border-secondary">Content name</span>
                    </div>
                        <input 
                            type="text" 
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                </div>
                <div className='col-2 m-2 mx-auto'>
                <button type="button" className="btn btn-secondary" data-toggle="tooltip" data-html="true" title="You can check/edit content in previous page after submittion">
                    <img className="rounded mx-auto d-block" src={require('../media/tooltip.png')} alt="Card image cap" style={{height:"22px", width:"22px", objectFit:"contain"}}/>
                </button>
                </div>
            </div>
            <div className="row">
                <div className="col-12 mx-auto border border-secondary rounded" >
                    <div style={divStyle}>
                        <Editor
                            editorState={editorState}
                            wrapperClassName="demo-wrapper"
                            editorClassName="demo-editor"
                            onEditorStateChange={(e) => setEditorState(e)}
                        />
                    </div>
                </div>
            </div>
            <div className="row justify-content-md-center">
                <div className="col-8 mx-auto my-2">
                    <button type="button" className="btn btn-secondary form-control" onClick={onSubmit}>Submit</button>
                </div>
                <div className="col-2 mx-auto my-2">
                    <button className="btn btn-secondary form-control" onClick={() => navigate(`/home/content/${courseId}`)}>Go back</button>
                </div>
            </div>
            </div>
        </>
    )
} 

export default AddnewContent
