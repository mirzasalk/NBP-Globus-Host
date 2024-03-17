import "./App.css";
import Header from "./Components/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register/Register";
import LogIn from "./Pages/LogIn/LogIn";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home/Home";
import { UserProvider } from "./reactContext/UserContext";
import InspectorPage from "./Pages/inspectorPage/InspectorPage";
import AdminPage from "./Pages/AdminPage/AdminPage";
import AdminLogin from "./Pages/AdminLogin/AdminLogin";
import QRCodeScanner from "./Components/QRCodeScanner";

function App() {
  return (
    <div className="appMain">
      <Toaster
        reverseOrder={false}
        position="top-center"
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#fff",
            color: "black",
          },

          // Default options for specific types
          success: {
            duration: 3000,
          },
        }}
      />
      <UserProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/logIn" element={<LogIn />} />
            <Route path="/home" element={<Home />} />
            <Route path="/inspectorPage" element={<InspectorPage />} />
            <Route path="/adminPage" element={<AdminPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/scanner" element={<QRCodeScanner />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
