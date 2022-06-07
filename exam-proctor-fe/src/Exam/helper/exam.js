import { API } from "../../backend"

export const getExamQuestions = async (courseId, userId, token) => {
    return fetch(`${API}/questions/${courseId}/${userId}`, {
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


export const checkExamFrequency = async (courseId, userId, token) => {
  return fetch(`${API}/check/exam/frequency/${courseId}/${userId}`, {
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


export const getQuestionsByCourseId = async (courseId, userId, token) => {
  return fetch(`${API}/creator/questions/${courseId}/${userId}`, {
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

export const getCourseAmountAndTime = async (courseId, userId, token) => {
  return fetch(`${API}/course/price/time/${courseId}/${userId}`, {
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

export const editExamTimeApi = async (userId, token, courseId, editedTime) => {
  return fetch(`${API}/edit/course/time/${courseId}/${userId}`, {
    method:"POST",
    headers:{    
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(editedTime)
  })
  .then(response => {
    return response.json()
  })
  .catch(err => console.log(err))
}


export const submitExam = async (userId, token, courseId, submitAnswers) => {
    return fetch(`${API}/submit/exam/${courseId}/${userId}`, {
      method:"POST",
      headers:{    
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(submitAnswers)
    })
    .then(response => {
      return response.json()
    })
    .catch(err => console.log(err))
  }

  export const RegisterFace = (imageData) => {
    return fetch(`${API}/face/register`, {
      method: "POST",
      mode:"cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ img: imageData })
    })
      .then(response => {
        return response.json();
      })
      .catch(err => console.log("================>",err));
  };
  
  export const AnalyseFace = (mainImage, currentImage) => {
    return fetch(`${API}/face/analyse`, {
      method: "POST",
      mode:"cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ img1: mainImage, img2: currentImage })
    })
      .then(response => {
        return response.json();
      })
      .catch(err => console.log("================>",err));
  };

  export const getCertificate = async (courseId, userId, token) => {
    return fetch(`${API}/certificate/${courseId}/${userId}`, {
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
  
  