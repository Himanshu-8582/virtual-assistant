import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";


export const userDataContext = createContext();

export default function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);


  const handleCurrUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
      const savedUserData = JSON.parse(localStorage.getItem("assistantData"));
      
      // Combine backend user info with local assistant data (if any)
      if (savedUserData) {
        setUserData({
          ...result.data,
          assistantName: savedUserData.assistantName,
          assistantImage: savedUserData.assistantImage,
        });
      } else {
        setUserData(result.data);
      }
      console.log(userData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleCurrUser();
  }, []);

   useEffect(() => {
    if (userData?.assistantName || userData?.assistantImage) {
      localStorage.setItem(
        "assistantData",
        JSON.stringify({
          assistantName: userData.assistantName,
          assistantImage: userData.assistantImage,
        })
      );
    }
  }, [userData]);

  const values = {
    serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage
  }
  return (
      <userDataContext.Provider value={values}>
        {children}
      </userDataContext.Provider>
  )
}
