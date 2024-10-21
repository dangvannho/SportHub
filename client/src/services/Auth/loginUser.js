import httpRequest from "~/utils/httpRequest"; 

const loginUser = (email, password) =>{
    
    const data = {
        email,
        password
    } 

    return httpRequest.post("api/auth/user_login", data)
} 

export default loginUser