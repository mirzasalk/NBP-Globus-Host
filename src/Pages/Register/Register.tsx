import "./register.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios-config";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  FirstName: string;
  LastName: string;
  Email: string;
  DateOfBirth: string;
  Password: string;
  City: string;
  Address: string;
  PhoneNumber: string;
  Gender: string | null;
}

interface FormErrors {
  FirstName: string;
  LastName: string;
  Email: string;
  DateOfBirth: string;
  Password: string;
  ConfirmPassword: string;
  City: string;
  Address: string;
  PhoneNumber: string;
  Gender: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [ConfirmPassword, setConfirmPassword] = useState<string>();
  const [formData, setFormData] = useState<FormData>({
    FirstName: "",
    LastName: "",
    Email: "",
    DateOfBirth: "",
    Password: "",
    Address: "",
    City: "",
    PhoneNumber: "",
    Gender: null,
  });

  const [errors, setErrors] = useState<FormErrors>({
    FirstName: "",
    LastName: "",
    Email: "",
    DateOfBirth: "",
    Password: "",
    Address: "",
    ConfirmPassword: "",
    City: "",
    PhoneNumber: "",
    Gender: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleInputChange("Gender", event.target.value); //ovo menjaj
  };

  const validateForm = (): boolean => {
    let isValid = true;

    const newErrors: FormErrors = {
      FirstName: "",
      LastName: "",
      Email: "",
      DateOfBirth: "",
      Password: "",
      Address: "",
      ConfirmPassword: "",
      City: "",
      PhoneNumber: "",
      Gender: "",
    };

    // Validacija za prazna polja
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof FormData;
      if (!formData[typedKey] && typedKey !== "Gender") {
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

    // Validacija za lozinku
    if (formData.Password.length < 8) {
      newErrors.Password = "Password must be at least 8 characters long.";
      isValid = false;
    }

    // Validacija za potvrdu lozinke
    if (formData.Password !== ConfirmPassword) {
      newErrors.ConfirmPassword = "Passwords do not match.";
      isValid = false;
    }

    // Validacija za radio dugmad
    if (!formData.Gender) {
      newErrors.Gender = "Please select a gender.";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await axiosInstance.post("Users/add", formData);
        console.log(response);
        toast.success("Register successfull");
        navigate("/logIn");
      } catch (error: any) {
        toast.error(error.response.data.Message);
        console.log("Registration failed", error);
      }
    } else {
      console.log("Form is invalid. Please check the errors.");
    }
  };

  return (
    <div id="RegisterMain">
      <div className="center-div">
        <img className="userIcon" src="regIcon2.png" alt="Register now" />
        <div className="inputDiv">
          <div className="inputHelperDiv">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              value={formData.FirstName}
              onChange={(e) => handleInputChange("FirstName", e.target.value)}
            />
          </div>
          <span className="error">{errors.FirstName}</span>
        </div>

        <div className="inputDiv">
          <div className="inputHelperDiv">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              value={formData.LastName}
              onChange={(e) => handleInputChange("LastName", e.target.value)}
            />
          </div>
          <span className="error">{errors.LastName}</span>
        </div>

        <div className="inputDiv">
          <div className="inputHelperDiv">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.Email}
              onChange={(e) => handleInputChange("Email", e.target.value)}
            />
          </div>
          <span className="error">{errors.Email}</span>
        </div>

        <div className="inputDiv">
          <div className="inputHelperDiv">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              placeholder="Date of Birth"
              value={formData.DateOfBirth}
              onChange={(e) => handleInputChange("DateOfBirth", e.target.value)}
            />
          </div>
          <span className="error">{errors.DateOfBirth}</span>
        </div>

        <div className="inputDiv">
          <div className="inputHelperDiv">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.Password}
              onChange={(e) => handleInputChange("Password", e.target.value)}
            />
          </div>
          <span className="error">{errors.Password}</span>
        </div>

        <div className="inputDiv">
          <div className="inputHelperDiv">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <span className="error">{errors.ConfirmPassword}</span>
        </div>
        <div className="inputDiv">
          <div className="inputHelperDiv">
            <label htmlFor="Address">Address:</label>
            <input
              type="text"
              id="city"
              placeholder="City"
              value={formData.Address}
              onChange={(e) => handleInputChange("Address", e.target.value)}
            />
          </div>
          <span className="error">{errors.Address}</span>
        </div>

        <div className="inputDiv">
          <div className="inputHelperDiv">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              placeholder="City"
              value={formData.City}
              onChange={(e) => handleInputChange("City", e.target.value)}
            />
          </div>
          <span className="error">{errors.City}</span>
        </div>

        <div className="inputDiv">
          <div className="inputHelperDiv">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              placeholder="Phone Number"
              value={formData.PhoneNumber}
              onChange={(e) => handleInputChange("PhoneNumber", e.target.value)}
            />
          </div>
          <span className="error">{errors.PhoneNumber}</span>
        </div>

        <div className="radioBtnDiv">
          <div className="radioBtnHelperDiv">
            <label>
              <input
                type="radio"
                value="male"
                checked={formData.Gender === "male"}
                onChange={handleOptionChange}
              />
              Male
            </label>

            <label>
              <input
                type="radio"
                value="female"
                checked={formData.Gender === "female"}
                onChange={handleOptionChange}
              />
              Female
            </label>
          </div>
          <span className="error">{errors.Gender}</span>
        </div>

        <button onClick={handleSubmit}>Register</button>
      </div>
    </div>
  );
};

export default Register;
