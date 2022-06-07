import { API } from "../../backend"

export const learnerProfileDetails = async (userId, token) => {
    return fetch(`${API}/profile/learner/${userId}`, {
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
