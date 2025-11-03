import React, { useContext, useEffect } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  // console.log("Log of home page", userData);
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      
    } catch (error) {
      console.log("nahi hua")
      console.log(error);
    } finally {
      localStorage.removeItem("assistantData");
      setUserData(null);
      navigate("/signin");
    }
  }


  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    console.log(text);
    console.log(utterence);
    window.speechSynthesis.speak(utterence);
  }


  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult =async (e) => {    // checking is our assistant is listening or not via browser
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heared : ", transcript);
      console.log(userData.assistantName);
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        const data = await getGeminiResponse(transcript)
        // console.log(data);
        // console.log(data.response);
        speak(data.response);
      }
    }

    recognition.start();

    // if(tr)

  },[])
  




  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#080862] flex justify-center items-center flex-col gap-[15px]">
      <button className='min-w-[150px] text-black font-semibold mt-[30px] text-[19px] h-[60px] bg-white absolute rounded-full top-[20px] 
        right-[20px] cursor-pointer' onClick={handleLogout}>Log Out</button>
      <button className='min-w-[150px] text-black font-semibold mt-[30px] text-[19px] h-[60px] bg-white absolute rounded-full top-[100px] 
        right-[20px] cursor-pointer px-[20px] py-[20px]' onClick={()=>navigate("/customize")}>Customize your assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl'>
        <img src={userData?.assistantImage} alt='' className='h-full object-cover' />
      </div>
      <h1 className='text-white  text-[18px] font-semibold'>I'm { userData?.assistantName}</h1>
    </div>
  )
}
