import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../user/helper/userapicalls";

export default function LearnerRoute({ children }) {
  const auth = isAuthenticated() && isAuthenticated().user.role === 0;
  return auth ? children : <Navigate to="/signin" />;
}
