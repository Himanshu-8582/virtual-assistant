import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userContext';

export default function Customize2() {
    const { userData } = useContext(userDataContext);

    const [assistantName, setAssistantName] = useState(userData?.assistantName || "");

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#080862] flex justify-center items-center flex-col">
          <h1 className='text-white text-[30px] text-center p-[20px] '>Enter your <span className='text-blue-200'>Assistant Image</span></h1>

        <input type="text" placeholder='Enter your name' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent
         text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]' 
          onChange={(e) => setAssistantName(e.target.value)} value={assistantName} required
        />
          { assistantName.length && <button className='cursor-pointer min-w-[300px] text-black font-semibold text-[19px] mt-[20px] h-[60px] bg-white rounded-full'
        onClick={()=>navigate("/customize2")}
        >Finally create your assistant</button>}
    </div>
  )
}
