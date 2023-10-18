import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN } from "../constants";
// import { toast } from "react-toastify";

const request = axios.create({
  baseURL: "https://ap-blog-backend.up.railway.app/api/v1/",
  timeout: 10000,
  headers: { Authorization: `Bearer ${Cookies.get(TOKEN)}` },
});

// request.interceptors.response.use((response) => response, (err) =>{
//   toast.error(err.response.data);
//   return Promise.reject(err);
// })

export default request;
