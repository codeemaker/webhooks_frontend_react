import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const LoginForm = () => {

  const loginFormDiv = useRef(null);
  const fetchURL =  process.env.REACT_APP_FETCH_URL;
  const navigate = useNavigate();
  const submitLogin = function(){
    let formData = new FormData(loginFormDiv.current);
    let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if(formData.get("email")==null || formData.get("email")==undefined || formData.get("email")=="" ||  pattern.test(formData.get("email"))==false){
        toast.error("Email invalid")
    }
    else if(formData.get("password")==null || formData.get("password")==undefined || formData.get("password")=="" || formData.get("password").length < 5){
        toast.error("password should have minimum five letters")
    }
    else{
        let data={
                email:formData.get("email"),
                password:formData.get("password")
        }

       axios.post(`${fetchURL}/api/login`,data,{
        headers:{
            "Content-Type":"application/json"
        }
       })
       .then((res)=>{
        console.log(res)
        if(res?.data?.status==true){
            toast.success("Login sucessfully");
            localStorage.setItem("token",res?.data?.token);
            localStorage.setItem("accountId",res?.data?.accountId);
            navigate("/dashboard");
        }
        else{
            toast.error(res?.data?.message)
        }
       })
       .catch((err)=>{
         console.log(err)
         toast.error(err?.response?.data?.message)
       })
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
        <h1 className='absolute top-5 left-5 font-bold'>WebHooks</h1>
      <div className="w-1/2 max-w-md">
        <form ref={loginFormDiv} className="bg-white shadow-md rounded px-8 py-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" id="email" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Enter your email" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input type="password" name="password" id="password" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Enter your password" />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={submitLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">Sign In</button>
          </div>
          <a href="/register" className="my-4 block underline">Don't have an account.Register</a>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
