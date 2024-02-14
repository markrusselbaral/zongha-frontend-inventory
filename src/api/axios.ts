import axios from "axios";

export default axios.create({
    baseURL : "http://ec2-3-26-10-163.ap-southeast-2.compute.amazonaws.com",
    withCredentials : true
})
