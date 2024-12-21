import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from './pages/Login/'
import Signup from './pages/Signup/'
import Home from './pages/Home/'
import ClassDetails from "./pages/ClassDetails";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/login" />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/home' element={<Home />} />
      <Route path='/class/:id' element={<ClassDetails />} />
    </Routes>
  );
}

export default App;
