import React, { useContext } from 'react';
import { userDataContext } from '../context/userContext';

export default function Card({ image }) {
    const { serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(userDataContext);
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0a0a39] 
      rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-3 hover:border-white
      ${selectedImage==image?"border-3 border-white shadow-2xl shadow-blue-950":null}`}
      onClick={()=>setSelectedImage(image)}
    >
          <img src={image} className='h-full object-cover ' />
    </div>
  )
}
 