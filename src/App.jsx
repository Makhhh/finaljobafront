import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from './pages/Profile';
import Face from './pages/Face';
import FaceLogin from './pages/FaceLogin';
import Settings from './pages/Settings'; // 👈 добавлено
import ProtectedRoute from './protect/ProtectedRoute'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/face" element={<Face />} />
        <Route path="/face-login" element={<FaceLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
