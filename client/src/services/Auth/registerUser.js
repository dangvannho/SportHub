import httpRequest from "~/utils/httpRequest";

const registerUser = (name, email, phone_number, password, confirmPassword) =>{
    const data = {
        name, 
        email, 
        phone_number,
        password,
        confirmPassword
    } 

    return httpRequest.post("api/auth/user_register", data)
}

export default registerUser