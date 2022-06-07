import {API} from "../../backend";

export async function signup(user) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const response = await fetch(`${API}/signup`,{
    mode:"cors",
    method: "POST",
    headers:myHeaders,
    body: JSON.stringify(user)
  })

  const data = await response.json()
  console.log("===>",data)

  return data
}

export async function signin(user) {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
  
    const response = await fetch(`${API}/signin`,{
      mode:"cors",
      method: "POST",
      headers:myHeaders,
      body: JSON.stringify(user)
    })
  
    const data = await response.json()
  
    return data
  }

export const getCategories = () => {
  return fetch(`${API}/categories`,{
      method: "GET"
    })
    .then(response => {
      return response.json()
    })
    .catch(err => console.log(err))
  }
  
export const authenticate = (data, next) => {
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt",JSON.stringify(data))
        next();
    }
}

export const isAuthenticated = () => {
  if(typeof window == "undefined"){
    return false
  }
  if (localStorage.getItem("jwt")){
    return JSON.parse(localStorage.getItem("jwt"))
  }else{
    return false
  }
}

export const signout = next => {
  if(typeof window !== "undefined"){
    localStorage.removeItem("jwt")
    next();

    return fetch(`${API}/signout`,{
      method:"GET",
    })
    .then(response => console.log("SIGN OUT SUCCESS"))
    .catch(err => console.log("ERROR WHILE SIGN OUT"))
  }
}
