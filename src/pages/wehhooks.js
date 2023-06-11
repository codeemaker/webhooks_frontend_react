import React, { useState, useRef, useEffect } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Webhooks = () => {
  const [showModal, setShowModal] = useState(false);
  const webhookForm = useRef(null);
  const [desData,setDesData] = useState([]);
  const [reload,setreload] = useState(false);
  const fetchURL =  process.env.REACT_APP_FETCH_URL;
  const navigate = useNavigate();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const submitForm = function(e){
    e.preventDefault();
    let pattern = /^(http|https):\/\/.*/;
    let formData = new FormData(webhookForm.current);
    if(formData.get("destUrl")==null || formData.get("destUrl")==undefined || formData.get("destUrl")=="" ||  pattern.test(formData.get("destUrl"))==false){
        toast.error("URL invalid")
    }
    else if(formData.get("destAction")==null || formData.get("destAction")==undefined || formData.get("destAction")=="" || formData.get("destAction").length < 5){
        toast.error("Action should have minimum five letters")
    }
    else{
        let accountId=localStorage.getItem("accountId");
        let token=localStorage.getItem("token");
        console.log(accountId,token)
        let data={
                id:accountId,
                url:formData.get("destUrl"),
                action:formData.get("destAction")
        }

       axios.post(`${fetchURL}/api/dest/register`,data,{
        headers:{
            "Content-Type":"application/json",
            "token":token
        }
       })
       .then((res)=>{
        console.log(res)
        if(res?.data?.status==true){
            toast.success(res?.data?.message);
            webhookForm.current.reset();
            setShowModal(false);
            setreload(!reload);
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
    axios.get(`${fetchURL}/api/dest/getDestinations?id=${localStorage.getItem("accountId")}`,{
        headers:{
            "Content-Type":"application/json",
            "token":localStorage.getItem("token")   
        }
    })
    .then((data)=>{
        console.log(data)
        setDesData(data?.data?.data);
    })
    .catch((err)=>{
        console.log(err);
    })
  },[reload])

  return (
    <div className="flex items-center justify-center h-screen">
      {/* <h1 className="absolute top-5 left-5 font-bold">WebHooks</h1> */}
      <button className="absolute top-5 left-5  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={openModal}>Add URL's</button>
      <button className="absolute top-5 right-5  bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("accountId");
        navigate("/");
      }}>Log Out</button>
      <div className="container mx-auto">
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">URL</th>
              <th className="py-3 px-6 text-center">Action</th>
              <th className="py-3 px-6 text-center">Craeted At</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {desData.map((fData)=>{
                return(
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-center">{fData.url}</td>
                        <td className="py-3 px-6 text-center">{fData.action}</td>
                        <td className="py-3 px-6 text-center">{fData.created_date}</td>
                    </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    </div>

      {showModal && (
        <form ref={ webhookForm } className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8">
          <div className="mb-4">
            <label htmlFor="destUrl" className="block text-gray-700 text-sm font-bold mb-2">WebHook's URL</label>
            <input type="url" name="destUrl" id="destUrl" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Enter the webhook url" />
          </div>
          <div className="mb-4">
            <label htmlFor="destAction" className="block text-gray-700 text-sm font-bold mb-2">Action</label>
            <input type="text" name="destAction" id="destAction" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Enter the webhook url" />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={submitForm} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">Submit</button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={closeModal}>Close</button>
          </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Webhooks;
