import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, signup } from "./helper/userapicalls";
import Select from 'react-select'
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const SignUp = () => {

  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const notify = (message) => toast(message)
  const [values,setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
    userType: {
      creator: false,
      learner: true
    },
    role: 0,
    category:""
  })

  const preload = () => {
    getCategories().then(data => {
      if(data.error) {
        setValues({...values, error: data.error})
        notify(data.error)
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

  const {name,email,password,error,success,role,category} = values

  const handleChange = name => event => {
    setValues({...values, error:false, [name]: event.target.value})
  }

  // Handle it better
  const onChangeForCreator = () => {
    setValues({
      ...values,
      userType:{
        creator:true,
        learner:false
      },
      role:1
    })
  }

  const onChangeForCategory = (category) => {
    setValues({
      ...values,
      category: category.value
    })
  }

  const onChangeForLearner = () => {
    setValues({
      ...values,
      userType:{
        creator:false,
        learner:true
      },
      role:0
    })
  }

  const onSubmit = async event => {
    event.preventDefault()
    setValues({...values,error:false})
    const userData = values.userType.creator ? {name,email,password,role} : {name,email,password,role,category}
    const data = await signup(userData)
      if(data.error){
        setValues({...values,error:data.error,success:false})
        notify(data.error)
      }else{
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          success: true
        })
        navigate("/")
      }
  }

  const signUpForm = () => {
    return (
      <>
      <div className="jumbotron jumbotron-fluid text-center">
      <div className="container">
        <img className="rounded mx-auto d-block" src={require('../media/slat.png')} alt="Card image cap" style={{height:"200px", width:"200px", objectFit:"contain"}}/>
        <p className="lead">Join ous to educate millions of people</p>
      </div>
      </div>

      <div className="row">
        <div className="col-md-4 offset-sm-3 text-left mx-auto">
          <form>
          <div className="form-group my-2">
              <label for="exampleInputEmail1">Name</label>
              <input type="email" 
                  className="form-control" 
                  id="exampleInputEmail1" 
                  aria-describedby="emailHelp" 
                  placeholder="Enter Name" 
                  onChange={handleChange("name")} 
                  value={name}/>
            </div>
            <div className="form-group my-2">
              <label for="exampleInputEmail1">Email address</label>
              <input type="email" 
                className="form-control" 
                id="exampleInputEmail1" 
                aria-describedby="emailHelp" 
                placeholder="Enter email"
                onChange={handleChange("email")}
                value={email}
              />
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="row m-2">
              <div className="form-check col">
                    <input className="form-check-input" checked={values.userType.creator} type="radio" name="userType" id="flexRadioDefault1" onChange={onChangeForCreator}/>
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                      Creator
                    </label>
                  </div>
                  <div className="form-check col">
                    <input className="form-check-input" checked={values.userType.learner} type="radio" name="userType" id="flexRadioDefault2" onChange={onChangeForLearner}/>
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                      Learner
                    </label>
              </div>
            </div>
            <div className="form-group my-2">
                  {values.userType.learner && (
                    <>
                    <label for="exampleInputEmail1">Select Role</label>
                    <Select options={categories} onChange={category => onChangeForCategory(category)}/>
                    </>
                    )}
            </div>
            <div className="form-group my-2">
              <label for="exampleInputPassword1">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="exampleInputPassword1" 
                placeholder="Password"
                onChange={handleChange("password")}
                value={password}
                />
            </div>
            <button type="submit" onClick={onSubmit} className="btn btn-secondary my-2 form-control">Submit</button>
          </form>
          <div className="container text-center">
            <p>Already have a account. <Link to={`/`}>Sign in</Link></p>
          </div>
      </div>
      </div>
      </>
    )
  }

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
        <div className="alert alert-success" style={{display: success ? "" : "none"}}>
          New account was created successfully        
        </div>
      </div>
    </div>
    )
  }

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
            {error}        
          </div>
        </div>
      </div>
    )
  }


  return(
    <>
      {successMessage()}
      {errorMessage()}
      {signUpForm()}
      {/* <p className="text-center">{JSON.stringify(values)}</p>
      <p className="text-center">{JSON.stringify(categories)}</p> */}
    </>
  )
}

export default SignUp