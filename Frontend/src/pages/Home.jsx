import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  // console.log("Log of home page", userData);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;


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


  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes('start')) {
        console.error('Error starting recognition:', error);
      }
    }
  }

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    
    isSpeakingRef.current = true;
    utterence.onend = () => {
      isSpeakingRef.current = false;
      startRecognition();
    };
    synth.speak(utterence);
  }

  
const handleCommand = (data) => {   //For handling command like youtube search, google search etc.
    const { type, userInput, response } = data;
    speak(response);
    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if (type==="calculator-open"){
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if(type==="instagram-open"){
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if(type==="facebook-open"){
      window.open(`https://www.facebook.com/`, '_blank');
    }
    if(type==="weather-show"){
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }
    if(type==="youtube-search" || type==="youtube-play"){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  }

  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognitionRef.current = recognition;

    const isRecognizingRef = { current: false };

    // optamizing recognition result handler
    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          // console.log("Recognition requested to start");
        } catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.error('Error starting recognition:', error);
          }
        }
      }
    }

    recognition.onStart = () => {
      // console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    }

    recognition.onend = () => {
      // console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);

      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error === 'aborted' || !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    }

    const fallback = setInterval(() => {
      if(!isRecognizingRef.current && !isSpeakingRef.current) {
        safeRecognition();
      }
    },10000);

    recognition.onresult =async (e) => {    // checking is our assistant is listening or not via browser
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heared : ", transcript);
      console.log(userData.assistantName);
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript)

        handleCommand(data);
        // speak(data.response);
      }
    }

    // recognition.start();
    safeRecognition();

    return () => {
      clearInterval(fallback);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    }

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