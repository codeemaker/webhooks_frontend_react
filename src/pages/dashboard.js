import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = () => {
  const fetchURL =  process.env.REACT_APP_FETCH_URL;
  const navigate = useNavigate();
  const dashboardForm = useRef(null);
  const [users,setUsers] = useState([]);

  const submitForm=(e)=>{
    e.preventDefault();
    let formData = new FormData(dashboardForm.current);
    console.log(formData.get("amount"))
    if(formData.get("payee")==null || formData.get("payee")==undefined || formData.get("payee")==""){
        toast.error("Please select payee name");   
    }
    else if(formData.get("amount")==null || formData.get("amount")==undefined || formData.get("amount")=="" || 
    formData.get("amount") <= 0){
        toast.error("Please enter valid amount");   
    }
    else if(formData.get("shortText")==null || formData.get("shortText")==undefined || formData.get("shortText")=="" || 
    formData.get("shortText").length < 5){
        toast.error("Shorttext should have minimum five letters")
    }
    else{
        let accountId=localStorage.getItem("accountId");
        let token=localStorage.getItem("token");
        console.log(accountId,token)
        let data={
            paidFrom:accountId,
            paidTo:formData.get("payee"),
            amount:formData.get("amount"),
            shortText:formData.get("shortText")
        }

       axios.post(`${fetchURL}/api/pay`,data,{
        headers:{
            "Content-Type":"application/json",
            "token":token
        }
       })
       .then((res)=>{
        console.log(res)
        if(res?.data?.status==true){
            toast.success(res?.data?.message)
            navigate("/dashboard")
            dashboardForm.current.reset();
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

  useEffect(()=>{
    axios.get(`${fetchURL}/api/getDetails`)
    .then((data)=>{
        console.log(data)
        setUsers(data?.data?.dataArr);
    })
    .catch((err)=>{
        console.log(err);
    })
  },[])

  return (
    <div className="flex items-center justify-center h-screen">
      {/* <h1 className="absolute top-5 left-5 font-bold">WebHooks</h1> */}
      <button className="absolute top-5 left-5  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={()=>{
        navigate("/webhooks")
      }}>Add WebHooks</button>
      <button className="absolute top-5 right-5  bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("accountId");
        navigate("/");
      }}>Log Out</button>
      <div className="w-1/2 max-w-md">
        <form ref={dashboardForm} className="bg-white shadow-md rounded px-8 py-6">
          <h2 className="text-2xl font-bold mb-6 text-center">WebHooks Pay</h2>
          <div className="mb-4">
            <label htmlFor="payee" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Payee Name</label>
            <select id="payee" name="payee" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              {users.map((fData)=>{
                return(
                    <>
                     <option value={fData.id}>{fData.name}</option>
                    </>
                )
              })}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
            <input type="number" name="amount" defaultValue="0" id="amount" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Enter amount" />
          </div>
          <div className="mb-6">
            <label htmlFor="shortText" className="block text-gray-700 text-sm font-bold mb-2">Short Text</label>
            <input type="text" name="shortText" id="shortText" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Enter short text" />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={submitForm} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">Pay</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
