import React, { useContext, useRef, useState } from 'react';
import Card from '../components/Card';
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import image8 from "../assets/image8.png";

export default function Customize() {

  const { serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(userDataContext);
  const inputImage = useRef();
  const navigate = useNavigate();
  
  console.log("customize: ", userData);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#080862] flex justify-center items-center flex-col">
      <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer'
              onClick={()=>navigate("/")}
            />
      <h1 className='text-white text-[30px] text-center p-[20px] '>Select your <span className='text-blue-200'>Assistant Image</span></h1>
      <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px] mb-30px'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <Card image={image8} />
        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#04044e] border-2 border-[#0a0a39] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 
          cursor-pointer border-3 hover:border-white flex items-center justify-center
          ${selectedImage=="input"?"border-3 border-white shadow-2xl shadow-blue-950":null}`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input")
          }}>
          {!frontendImage && <RiImageAddLine className='text-white w-[25px] h-[25px]' />}
          {frontendImage && <img src={ frontendImage } className='h-full object-cover'/>}
          
        </div>
        <input type="file" accept='image/*' ref={inputImage} onChange={handleImage} hidden/>
      </div>
      {selectedImage &&
        <button className='cursor-pointer min-w-[150px] text-black font-semibold text-[19px] mt-[20px] h-[60px] bg-white rounded-full'
        onClick={()=>navigate("/customize2")}
        >Next</button>
      }
    </div>
  );
}
