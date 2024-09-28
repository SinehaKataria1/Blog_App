import React, { useEffect, useRef, useState } from "react";    
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Posts from "./Posts"; 
import PostDetail from "./PostDetail";
import Dashboard from "./Dashboard"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { AiFillDropboxCircle } from "react-icons/ai";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [show,setShow]=useState(false);
  const profileRef = useRef(null);
  const handleLogin = () => {
    setIsLoggedIn(true);
    setShow(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('email');
    setShow(false);
    console.log("Email removed from localStorage");
  };
  const profile=()=>{
    setShow(true);
  }
 // Close the profile when clicking outside of it
 useEffect(() => {
  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShow(false); 
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [profileRef]);
  return (
    <BrowserRouter>
      <nav className="div2">
        <h1>
          <AiFillDropboxCircle />
          Sk
        </h1>
        <div className="div4">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <button className="login">Login</button>
              </Link>
              <Link to="/register">
                <button className="register">Register</button>
              </Link>
            </>
          ) : (
            <>
               <div className="d-flex justify-content-center profile me-2" onClick={profile} ref={profileRef}>
                
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="" style={{width:"40px"}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
               </svg>
               {show && ( 
                <div className="logfun">
                      <ul className="">
                      <li className="text-center  " style={{fontWeight:"bolder"}}> 
                        {localStorage.getItem('email').split('@')[0]}</li>
                      <li>{localStorage.getItem('email')}</li>
                      
                    <li><button onClick={handleLogout} className="logout mt-3 ms-4">Logout</button></li>
                    </ul>
                  </div> 
                
              )}

             </div>
              <Link to="/"><button className="login">Dashboard</button></Link> 
              <Link to="/posts"><button className="login">Posts</button></Link>
             
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<Posts isLoggedIn={isLoggedIn} />} />
        <Route path="/" element={<Dashboard isLoggedIn={isLoggedIn} />} /> 
        <Route path="/post/:id" element={<PostDetail />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
