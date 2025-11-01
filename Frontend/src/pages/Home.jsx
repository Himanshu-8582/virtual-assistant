import React, { useContext } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
  // console.log("Log of home page", userData);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  }
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
