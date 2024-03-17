import "./adminLogin.css";
import toast from "react-hot-toast";
import React, { useState, FormEvent, useEffect } from "react";
import axiosInstance from "../../api/axios-config";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../reactContext/UserContext";


interface FormData {
  Email: string;
  Password: string;
}

interface FormErrors {
  Email: string;
  Password: string;
}

const AdminLogin: React.FC = () => {

  const { setUser } = useContext(UserContext) ?? {};

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    Email: "",
    Password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    Email: "",
    Password: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = (): boolean => {
    let isValid = true;

    const newErrors: FormErrors = {
      Email: "",
      Password: "",
    };

    // Validacija za prazna polja
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof FormData;
      if (!formData[typedKey]) {
        newErrors[typedKey] = "This field is required.";
        isValid = false;
      }
    });

    // Validacija za email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.Email && !emailRegex.test(formData.Email)) {
      newErrors.Email = "Invalid email address.";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await axiosInstance.post("Admins/Login", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (setUser) {
          setUser(response.data.data);
        } else {
          console.error("setUser is undefined");
        }

        toast.success("Log in successfull");

        localStorage.setItem("token", response.data.token);
       
        navigate("/adminPage");
      } catch (error: any) {
        toast.error(error.response.data.Message);
      }
    } else {
      console.log("Form is invalid. Please check the errors.");
    }
  };

 useEffect(()=>{
  localStorage.clear();
 },[]);

  return (
    <div id="adminLogInMain">
      <div className="adminCenter-LogIn-div">
        <img className="adminUserIcon" src="regIcon2.png" alt="Register now" />

        <div className="adminLogInInputDiv">
          <div className="adminLogInInputHelperDiv">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.Email}
              onChange={(e) => handleInputChange("Email", e.target.value)}
            />
          </div>
          <span className="adminError">{errors.Email}</span>
        </div>

        <div className="adminLogInInputDiv">
          <div className="adminLogInInputHelperDiv">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.Password}
              onChange={(e) => handleInputChange("Password", e.target.value)}
            />
          </div>
          <span className="adminError">{errors.Password}</span>
        </div>

        <button onClick={handleSubmit}>Log in</button>
      </div>
    </div>
  );
};

export default AdminLogin;
