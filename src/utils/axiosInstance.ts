import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://stupefied-hellman-uc-fm3ppt.liara.run/"
});

export default axiosInstance;
