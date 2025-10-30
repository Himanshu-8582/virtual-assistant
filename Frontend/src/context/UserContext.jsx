import React, { createContext } from 'react'


export const userDataContext = createContext();

export default function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const values = {
    serverUrl
  }
  return (
    <div>
      <userDataContext.Provider value={values}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}
