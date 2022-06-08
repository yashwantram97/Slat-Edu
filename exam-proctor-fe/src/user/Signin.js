import React,{useState} from "react";
import { authenticate, signin } from "./helper/userapicalls";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const SignIn = () => {
  const navigate = useNavigate()
  const [values,setValues] = useState({
    email: "",
    password: "",
    loading: false,
    error: "",
    didRedirected: false
  })

  const notify = (message) => toast(message)

  const {email,password,error} = values

  const handleChange = name => event => {
    setValues({...values,loading:false,[name]: event.target.value})
  }

  const onSubmit = async event => {
    event.preventDefault()
    setValues({...values,loading:true})
    const data = await signin({email,password})
      if(data.error){
        setValues({...values,error:data.error,loading:false})
        notify(data.error)
      }else{
        authenticate(data, () => {
          setValues({
            ...values,
            email:"",
            password:"",
            didRedirected: true
          });
        });
        if (data.user.role === 1){
          navigate("/dashboard/creator")
        }else if(data.user.role === 0){
          navigate("/dashboard/learner")
        }
      }
  }

  const signInForm = () => {
    return (
      <>
      <ToastContainer/>
      <div className="jumbotron jumbotron-fluid text-center">
      <div className="container">
        <img className="rounded mx-auto d-block" src={require('../media/slat.png')} alt="Card image cap" style={{height:"200px", width:"200px", objectFit:"contain"}}/>
        <p className="lead">Login in and start to create and learn</p>
      </div>
      </div>

      <div className="row">
        <div className="col-md-4 offset-sm-3 text-left mx-auto">
          <form>
            <div className="form-group my-2">
              <label for="exampleInputEmail1">Email address.</label>
              <input type="email" 
                className="form-control" 
                id="exampleInputEmail1" 
                aria-describedby="emailHelp" 
                placeholder="Enter email"
                onChange={handleChange("email")} 
                value={email}
              />
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
            <p>Don't have a account. <Link to={`/signup`}>Creat one</Link></p>
          </div>
      </div>
      </div>
      </>
    )
  }

  return(
    <>
      {signInForm()}
      <p className="text-white text-center">{JSON.stringify(values)}</p>
    </>
  )
}

export default SignIn