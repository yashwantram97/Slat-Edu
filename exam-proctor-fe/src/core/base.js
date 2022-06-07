import React from "react";
import Menu from "./menu";

const Base = ({title,desciption,className,children}) => (
  <div>
    <Menu/>
    <div className="container-fluid">
      <div className="jumbotron bg-dark text-white text-center">
        <h2 className="display-4">{title}</h2>
        <p className="lead">{desciption}</p>
      </div>
      <div className={className && className}>
        {children}
      </div>
    </div>
  </div>
)

export default Base;