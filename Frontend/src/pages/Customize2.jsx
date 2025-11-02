import React, { useContext, useState,useEffect } from 'react'
import { userDataContext } from '../context/UserContext.jsx';
import axios from 'axios';

import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export default function Customize2() {

  const navigate = useNavigate();
  const { userData, serverUrl, backendImage, selectedImage, setUserData } = useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loader, setLoader] = useState(false);
  
  const handleUpdateAssistant = async () => {
    setLoader(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true });
      setLoader(false);
      // console.log(result.data);
      setUserData(result.data);
      navigate("/");
      // console.log(userData);
    } catch (error) {
      console.log("Error Nothing:  ", error);
      setLoader(false);
    }
  }


  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#080862] flex justify-center items-center flex-col relative">
      <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer'
        onClick={()=>navigate("/customize")}
      />
        <h1 className='text-white text-[30px] text-center p-[20px] '>Enter your <span className='text-blue-200'>Assistant Image</span></h1>

        <input type="text" placeholder='Enter your name' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent
         text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]' 
          onChange={(e) => setAssistantName(e.target.value)} value={assistantName} required
        />
          { assistantName.length && <button className='cursor-pointer min-w-[300px] text-black font-semibold text-[19px] mt-[20px] h-[60px] bg-white rounded-full'
        disabled={loader}
        onClick={() => {
          handleUpdateAssistant();
        }}
      >{ !loader?'Finally create your assistant':"Loading..."}</button>}
    </div>
  )
}
