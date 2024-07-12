const {axiosInstance} = require('./index')


//Register User
export const RegisterUser = async(value) => {
    try{
        const response = await axiosInstance.post("api/users/register",value);
        console.log(response.data);
        return response.data;
    }
    catch(error){
        console.log(error)
    }
}




//Login User
export const LoginUser = async(value) => {
    try{
        const response = await axiosInstance.post("api/users/login",value);
        console.log(response.data);
        return response.data;
    }
    catch(error){
        console.log(error)
    }
}