import React, { useState,useEffect } from 'react';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Link, useNavigate,useParams,useLocation } from 'react-router-dom';
import { editCourseContent } from './helper/courseContent';
import { ToastContainer, toast } from 'react-toastify';
import { isAuthenticated } from '../user/helper/userapicalls';
import { getContentByContentId } from './helper/courseContent';

const EditContent = () => {

    const [editorState,setEditorState] =useState(EditorState.createEmpty()) 
    const [title,setTitle] = useState("")
    const {token} = isAuthenticated()
    let {contentId} = useParams();
    const location = useLocation();
    const {courseId} = location.state
    const navigate = useNavigate()

    const preload = async () => {
        const data = await getContentByContentId(contentId,token)
        if(data.error){
            notify("Can't fetch content")
        }else{
            const sampleMarkup = data.string

            const blocksFromHTML = convertFromHTML(sampleMarkup);
        
            const state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
        
            setEditorState(EditorState.createWithContent(state))
            setTitle(data.title)
        }
    }

    useEffect(() => {
        preload()
    },[])

    const divStyle={
        overflowY: 'scroll',
        height:'700px',
        position:'relative'
      };

    const notify = (message) => toast(message)

    const onSubmit = async event => {
        event.preventDefault()
        const data = await editCourseContent(contentId,token,{title,htmlString:draftToHtml(convertToRaw(editorState.getCurrentContent()))})
          if(data.error){
            notify("Something went wrong")
          }else{
            notify("Content updated successfully")
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
                <button type="button" className="btn btn-secondary" data-toggle="tooltip" data-html="true" title="Click 'check' to check how you content looks">
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
            <div className="row">
                <div className="col-8 mx-auto m-2">
                    <button type="button" className="btn btn-secondary form-control" onClick={onSubmit}>Edit</button>
                </div>
                <div className="col-2 mx-auto m-2">
                    <button className="btn btn-secondary form-control" onClick={() => navigate(`/home/content/${courseId}`)}>Go back</button>
                </div>
                {/* <div className="col-2 mx-auto m-2 my-auto text-secondary text-decoration-none">
                    <Link target={"_blank"} to={`/sample/${contentId}`} state={{courseId:courseId,backPath=`/edit/${contentId}`}} >Check</Link>
                </div> */}
            </div>
            </div>
        </>
    )
} 

export default EditContent
