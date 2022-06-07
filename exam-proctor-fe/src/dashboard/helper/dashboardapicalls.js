import { API } from "../../backend"

export const getCourseByCreatorId = async (userId, token) => {
    return fetch(`${API}/creator/courses/${userId}`, {
      method:"GET",
      headers:{    
      Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      return response.json()
    })
    .catch(err => console.log(err))
  }

export const getCourseByCourseIds = async (userId, token, courseIds) => {
    return fetch(`${API}/courses/ids/${userId}`, {
      method:"POST",
      headers:{    
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(courseIds)
    })
    .then(response => {
      return response.json()
    })
    .catch(err => console.log(err))
  }
  
