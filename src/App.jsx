import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AOS from "aos";
import "aos/dist/aos.css";
import Home from './pages/Home'
import RegisterFrom from './pages/RegisterForm'
import Profile from './pages/Profile'
// import Search from './components/Search'
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import Artists from './pages/Artists';
import Lessons from './pages/Lessons';
import LessonPlayer from './pages/LessonPlayer';
import Asaro_Loomis_Construction_Enhanced from './pages/AsaroMediaPipeOverlay';
import AddLesson from './pages/AddLesson';
import AdminRoute from './routes/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: false,
      mirror: true,
      easing: "ease-in- out",
    });
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/form" element={<RegisterFrom />} />
        {/* <Route path="/search" element={<Search />} /> */}
        <Route path="/artists" element={<Artists />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route element={<AdminRoute/>}>
          <Route path="/admin" element={<AdminDashboard/>} />
        </Route>
        <Route path="/add-lesson" element={<AddLesson />} />
        <Route path="/AsaroMediaPipeOverlay" element={<Asaro_Loomis_Construction_Enhanced />} />
        <Route path="/lesson/:id" element={<LessonPlayer />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
