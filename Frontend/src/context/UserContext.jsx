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
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleCurrUser();
  }, []);


  const values = {
    serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage
  }
  return (
    <div>
      <userDataContext.Provider value={values}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}
