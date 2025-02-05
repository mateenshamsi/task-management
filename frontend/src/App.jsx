import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskBoard from "./components/TaskBoard";
import { UserContext } from "./context/UserContext";

function App() {
  const { userInfo } = useContext(UserContext);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Redirect to login if userInfo is not present */}
        <Route path="/" element={userInfo ? <TaskBoard /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
