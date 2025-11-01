import React, { useContext } from 'react'
import bg from '../assets/authBg.png'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userDataContext } from '../context/userContext.jsx';

export default function SignUp() {
  const navigate = useNavigate();

  const {serverUrl,userData, setUserData} = useContext(userDataContext);

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result=await axios.post(`${serverUrl}/api/auth/signup`,{
        name,
        email,
        password
      }, {withCredentials : true});
      // console.log(result);
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setError(error.response.data.message);
      setLoading(false);
    }
  }

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{
      backgroundImage: `url(${bg})`
    }}>
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur shadow-lg shadow-black flex 
      flex-col justify-center items-center gap-[20px] px-[30px]' onSubmit={handleSignUp}>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>

        <input type="text" value={name} placeholder='Enter your name' className='w-full h-[60px] outline-none border-2 border-white bg-transparent
         text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]' required onChange={(e)=>setName(e.target.value)} />
        
        <input type="email" value={email} placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent
         text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]' required onChange={(e)=>setEmail(e.target.value)} />
        
        <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
          <input type={showPassword?"text":"password"} value={password} placeholder='Password' className='w-full h-[60px] outline-none bg-transparent placeholder-gray-300 
          px-[20px] py-[10px] rounded-full ' required onChange={(e)=>setPassword(e.target.value)}
          />
          {!showPassword &&
            <IoEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setShowPassword(true)} />
          }

          {showPassword &&
            <IoEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setShowPassword(false)} />
          }
          
        </div>
        {error.length > 0 && <p className='text-red-500'>*{error }</p>}

        <button className='min-w-[150px] text-black font-semibold text-[19px] mt-[20px] h-[60px] bg-white rounded-full' disabled={loading}>{loading?"loading...":"Sign Up"}</button>
        <p className='text-[white] text-[19px] cursor-pointer' onClick={()=>navigate("/signin")}>Already have an account?
          <span className='text-blue-400'> Sign In</span>
        </p>

    </form>
    </div>
  )
}
