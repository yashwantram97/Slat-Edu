import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../user/helper/userapicalls";

export default function CreatorRoute({ children }) {
  const auth = isAuthenticated() && isAuthenticated().user.role === 1;
  return auth ? children : <Navigate to="/signin" />;
}
