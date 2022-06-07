import React,{useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../creator/helper/course";
import { isAuthenticated } from "../user/helper/userapicalls";
import { MultiSelect } from "react-multi-select-component";
import { getCategories } from "../user/helper/userapicalls";
import { getCourseByCourseIds } from "./helper/dashboardapicalls";
import Base from "../core/base";
import { ToastContainer, toast } from 'react-toastify';

const LearnerDashboard = () => {

    const [values,setValues] = useState([])
    const navigate = useNavigate()
    const {user, token} = isAuthenticated()
    const [categories, setCategories] = useState([])
    const [selected, setSelected] = useState([]);
    const notify = (message) => toast(message)

    const preload = () => {
        getCourses(user._id,token).then(data => {
          if(data.error) {
            setValues({...values, error: data.error})
            notify(data.error)
          }else{
            const defaultImage = 'https://img.favpng.com/23/7/4/computer-icons-educational-technology-learning-training-course-png-favpng-j5t2UTpdMx23LZhscuTVqAJGb.jpg'
            setValues(data.map(course => {
              return {
                  id: course._id, 
                  title: course.name, 
                  desciption: course.description, 
                  image: course.image === "" ? defaultImage : course.image,
                  updatedAt: course.updatedAt
                }
            }))
          }
        })

        getCategories().then(data => {
            if(data.error) {
              notify("Something went wrong while fetching categories")
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

    const getAllCourses = () => {
        return values.map(course => {
         return (
            <div className="card mx-5 my-3" style={{width:"25rem"}}>
                <img className="rounded mx-auto d-block" src={course.image} alt="Card image cap" style={{height:"200px", width:"200px", objectFit:"contain"}}/>
                <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.desciption}</p>
                <button className="btn btn-secondary" onClick={() => navigate(`/course/${course.id}`)}>Go to course</button>
                </div>
                <div className="card-footer">
                <small className="text-muted">Last updated {course.updatedAt}</small>
                </div>
            </div>
         )   
        })
    }

    const search = async () => {
        const categoryIds = selected.map(category => category.value)
        await getCourseByCourseIds(user._id,token,{categoryIds}).then(data => {
            if(data.error) {
              setValues({...values, error: data.error})
            }else{
              const defaultImage = 'https://img.favpng.com/23/7/4/computer-icons-educational-technology-learning-training-course-png-favpng-j5t2UTpdMx23LZhscuTVqAJGb.jpg'
              setValues(data.map(course => {
                return {
                    id: course._id, 
                    title: course.name, 
                    desciption: course.desciption, 
                    image: course.image === "" ? defaultImage : course.image
                  }
              }))
            }
          })  
    }

    return (
      <Base>
          <ToastContainer/>
          <div className="container">
              <div>
              <div className="row justify-content-center mx-atuo">
              <MultiSelect
                  options={categories}
                  value={selected}
                  onChange={setSelected}
                  labelledBy="Select categories"
                  className="col-6"
              />
              <button type="button" className="btn btn-primary col-2" onClick={search}>Search</button>
              </div>
              </div>
          </div>

          <div className="card-deck my-4">
                <div className="row justify-content-md-center">
                    {getAllCourses()}
                </div>
          </div>
      </Base>
    )
}

export default LearnerDashboard