import {API,KEY_ID} from "../../backend";
import axios from "axios";

export const createCourse = async (userId, token, course) => {
    return fetch(`${API}/add/course/${userId}`, {
      method:"POST",
      headers:{    
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(course)
    })
    .then(response => {
      return response.json()
    })
    .catch(err => console.log(err))
  }

export const addNewQuestion = async (userId, token, courseId, question) => {
  return fetch(`${API}/add/question/${courseId}/${userId}`, {
    method:"POST",
    headers:{    
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(question)
  })
  .then(response => {
    return response.json()
  })
  .catch(err => console.log(err))
}

export const editQuestion = async (userId, token, courseId, question) => {
  return fetch(`${API}/edit/question/${courseId}/${userId}`, {
    method:"PUT",
    headers:{    
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(question)
  })
  .then(response => {
    return response.json()
  })
  .catch(err => console.log(err))
}

const initPayment = (data, courseId, userId,token,setIsEnrolled) => {
  const options = {
    key: KEY_ID,
    amount: data.amount,
    currency: data.currency,
    name: "Exam",
    description: "Test Transaction",
    order_id: data.id,
    handler: async (response) => {
      try {
        const verifyUrl = `${API}/verify/${courseId}/${userId}`;
        const { data } = await axios.post(verifyUrl, response,{
          headers: {
            Authorization: 'Bearer ' + token 
          }
        });
        setIsEnrolled(true)
      } catch (error) {
        console.log(error);
      }
    },
    theme: {
      color: "#3399cc",
    },
  };
  const rzp1 = new window.Razorpay(options);
  rzp1.open();
};

export const handlePayment = async (courseId,userId,token,courseFee,setIsEnrolled) => {
  try{
    const orderUrl = `${API}/orders/${userId}`;
    const {data} = await axios.post(orderUrl, {amount:courseFee},{
      headers: {
        Authorization: 'Bearer ' + token 
      }
    })

    initPayment(data.data,courseId,userId,token,setIsEnrolled)

    console.log(data)
  }catch(err){
    console.log(err)
  }
}

export const creatorProfileDetails = async (userId, token) => {
    return fetch(`${API}/profile/creator/${userId}`, {
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

export const checkQuestionsAreAvailable = async (courseId, token) => {
  return fetch(`${API}/check/enroll/${courseId}`, {
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

export const getCourse = async (userId, token, courseId) => {
    return fetch(`${API}/course/${courseId}/${userId}`, {
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

export const getCourses = async (userId, token) => {
    return fetch(`${API}/courses/${userId}`, {
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

export const checkIfUserIsEnrolledInExam = async (courseId, userId, token) => {
  return fetch(`${API}/check/enroll/${courseId}/${userId}`, {
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

export const enrollExam = async (courseId, userId, token) => {
  return fetch(`${API}/exam/enroll/${courseId}/${userId}`, {
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
