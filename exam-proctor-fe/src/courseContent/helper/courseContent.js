import {API} from "../../backend";

export const createCourseContent = async (courseId, token, content) => {
    return fetch(`${API}/add/content/${courseId}`, {
      method:"POST",
      headers:{    
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(content)
    })
    .then(response => {
      return response.json()
    })
    .catch(err => console.log(err))
  }

  export const editCourseContent = async (contentId, token, content) => {
    return fetch(`${API}/edit/content/${contentId}`, {
      method:"PUT",
      headers:{    
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(content)
    })
    .then(response => {
      return response.json()
    })
    .catch(err => console.log(err))
  }


export const getContentByContentId = async (contentId, token) => {
    return fetch(`${API}/content/string/${contentId}`, {
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

export const getContentsByCouseId = async (contentId, userId, token) => {
    return fetch(`${API}/contents/${contentId}/${userId}`, {
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

export const deleteByContentId = async (contentId, userId, token) => {
    return fetch(`${API}/delete/${contentId}/${userId}`, {
        method:"DELETE",
        headers:{    
        Authorization: `Bearer ${token}`,
        }
      })
      .then(response => {
        return response.json()
      })
      .catch(err => console.log(err))  
}
