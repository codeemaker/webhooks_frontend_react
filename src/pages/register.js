import React,{ useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const fetchURL =  process.env.REACT_APP_FETCH_URL;
  const register=useRef(null);
  const navigate = useNavigate();
  const submitForm=(e)=>{
    e.preventDefault();
    let formData = new FormData(register.current);
    let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if(formData.get("name")==null || formData.get("name")==undefined || formData.get("name")=="" || formData.get("name").length < 5){
        toast.error("Name should have minimum five letters")
    }
    else if(formData.get("email")==null || formData.get("email")==undefined || formData.get("email")=="" ||  pattern.test(formData.get("email"))==false){
        toast.error("Email invalid")
    }
    else if(formData.get("password")==null || formData.get("password")==undefined || formData.get("password")=="" || formData.get("password").length < 5){
        toast.error("password should have minimum five letters")
    }
    else{
        let data={
                email:formData.get("email"),
                name:formData.get("name"),
                password:formData.get("password")
        }

       axios.post(`${fetchURL}/api/register`,data,{
        headers:{
            "Content-Type":"application/json"
        }
       })
       .then((res)=>{
        console.log(res)
        if(res?.data?.status==true){
            toast.success(res?.data?.message)
            navigate("/")
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
        <form className="bg-white shadow-md rounded px-8 py-6" ref={register}>
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input type="email" name="name" id="name" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Enter your name" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" id="email" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Enter your email" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input type="password" name="password" id="password" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Enter your password" />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={submitForm} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">Sign Up</button>
          </div>
          <a href="/" className="my-4 block underline">Back to Login</a>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
