import React,{useState, useEffect} from "react";
import { getCategories } from "../user/helper/userapicalls";
import Select from 'react-select'
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../user/helper/userapicalls";
import { createCourse } from "./helper/course";
import Base from "../core/base";
import { ToastContainer, toast } from 'react-toastify';

const CreateCourse = () => {

    const navigate = useNavigate()
    const {user, token} = isAuthenticated()
    const [categories,setCategories] = useState([])
    const [courseValues, setCourseValues] = useState({
        name:"",
        description:"",
        image:"",
        category:"",
        error:"",
        success:false
    })

    const {name, description, image, category} = courseValues
    const notify = (message) => toast(message)

    const onSubmit = async event => {
        event.preventDefault()
        const data = await createCourse(user._id,token,{name,description,image,category,createdBy:user._id})
          if(data.error){
            setCourseValues({...courseValues,error:data.error,success:false})
            notify(data.error)
          }else{
            setCourseValues({
              ...courseValues,
              name: "",
              email: "",
              password: "",
              error: "",
              success: true
            })
            navigate(`/course/${data.id}`)
          }
      }
    
    const preload = () => {
        getCategories().then(data => {
          if(data.error) {
            notify("Error while getting categories")
        }else{
            setCategories(data.map(category => {
              return {value: category._id, label: category.name}
            }))
          }
        })
    }

    useEffect(() => {
        preload()
    },[])

    const handleChange = name => event => {
        setCourseValues({...courseValues, [name]: event.target.value})
      }
    
    const onChangeForCategory = (category) => {
        setCourseValues({
            ...courseValues,
            category:category.value
        })
      }

    return (
      <Base>
        <ToastContainer/>
        <div className="container my-4">
            <div className="row justify-content-md-center">
                <div className="col">
                    <div className="jumbotron text-center">
                        <h1 className="display-4">Create Course</h1>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
          <div className="col-6 mx-auto">
              <form>
                <div className="form-group m-2">
                    <label for="exampleFormControlInput1">Title</label>
                    <input type="email" 
                        className="form-control" 
                        id="exampleFormControlInput1" 
                        placeholder="Example. React basics"
                        value={name}
                        onChange={handleChange("name")}
                        />
                </div>
                <div className="form-group m-2">
                    <label for="exampleFormControlTextarea1">Description</label>
                    <textarea 
                        className="form-control" 
                        id="exampleFormControlTextarea1" 
                        rows="3"
                        value={description}
                        placeholder="Example. Learn everything about React"
                        onChange={handleChange("description")}
                        />
                </div>
                <div className="form-group m-2">
                  <label for="exampleFormControlInput1">Course category</label>
                    <Select options={categories} onChange={category => onChangeForCategory(category)}/>
                </div>
                <div className="form-group m-2">
                    <label for="exampleFormControlInput1">Cover Image</label>
                    <input className="form-control" 
                        id="exampleFormControlInput1" 
                        placeholder="Place a valid URL"
                        value={image}
                        onChange={handleChange("image")}                
                    />
                </div>
                <button onClick={onSubmit} className="btn btn-success btn-block form-control m-2">Submit</button>
            </form>
          </div>
        </div>
        </Base>
    )
}

export default CreateCourse