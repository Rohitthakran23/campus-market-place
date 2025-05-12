import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from "./components/login"
import Home from "./components/home"
import { Component } from 'react';
function App() {
  return (
    
    // <BrowserRouter>
    //   <Routes>
    //   <Route path="/" element={<Home />} />
    //       <Route path="/admin" element={<Admin />} />
    //       <Route path="/login" element={<Login />} />
    //   </Routes>
    // </BrowserRouter>
    <Home/>
  );
}

export default App;


