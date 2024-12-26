import { Navigate, Route, Routes } from "react-router-dom";

import Login from './pages/Login/'
import Signup from './pages/Signup/'
import Home from './pages/Home/'
import ClassDetails from "./pages/ClassDetails";
import VideoDetails from './pages/VideoDetails';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/login" />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/home' element={<Home />} />
      <Route path='/class/:id' element={<ClassDetails />} />
      <Route path="/video/:videoId" element={<VideoDetails />} />
    </Routes>
  );
}

export default App;
