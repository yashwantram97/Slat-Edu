import React,{Fragment} from "react";
import { Link,useLocation,useNavigate } from "react-router-dom";
import { isAuthenticated,signout } from "../user/helper/userapicalls";

const currentTab = (location, path) => {
  if(location.pathname === path){
    return { color: "#2ecc72"}
  }else{
    return {color: "#FFFFFF"}
  }
}

const Menu = () => {
  let location = useLocation();
  const {user, token} = isAuthenticated()
  let navigate = useNavigate();
  
  return(
    <div>
      <ul className="nav nav-tabls bg-dark justify-content-start" style={{paddingLeft:"12.5rem",paddingTop:"1rem",paddingBlock:"1rem"}}>
        {
          isAuthenticated() && (
            <li className="nav-item">
              <Link style={currentTab(location,user.role === 1 ? "/dashboard/creator" : "/dashboard/learner")} className="nav-link" to={user.role === 1 ? "/dashboard/creator" : "/dashboard/learner"}>
                Dashboard
              </Link>
            </li>              
          )
        }
        <li className="nav-item">
          <Link style={currentTab(location,user.role === 1 ? `/profile/creator`:`/profile/learner`)} className="nav-link" to={location,user.role === 1 ? `/profile/creator`:`/profile/learner`}>
            profile
          </Link>
        </li>
        {
          !isAuthenticated() && (
            <Fragment>
            <li className="nav-item">
              <Link style={currentTab(location,"/signup")} className="nav-link" to="/signup">
                Sign up
              </Link>
            </li>
            <li className="nav-item">
              <Link style={currentTab(location,"/signin")} className="nav-link" to="/signin">
                Sign in
              </Link>
            </li>
          </Fragment>  
          )
        }
        {isAuthenticated() && (
          <li className="nav-item">
            <span className="nav-link text-warning" onClick={() => signout(() => {
                navigate("/",{replace:true})
            })}>
              Sign out
            </span>
          </li>          
        )}
      </ul>
    </div>
  )
}

export default Menu