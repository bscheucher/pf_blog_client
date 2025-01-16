import { useState } from "react";

const useValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = (fieldName, value) => {
    let error = "";

    if (fieldName === "username" && value.trim().length < 3) {
      error = "Username must be at least 3 characters.";
    } else if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Invalid email format.";
      }
    } else if (fieldName === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
      if (!passwordRegex.test(value)) {
        error =
          "Password must be at least 6 characters, contain 1 number, 1 uppercase, and 1 lowercase letter.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));

    return error === "";
  };

  const validateForm = (formData) => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const isValid = validate(key, formData[key]);
      if (!isValid) {
        newErrors[key] = errors[key];
      }
    });

    return Object.keys(newErrors).length === 0;
  };

  return { errors, validate, validateForm };
};

export default useValidation;
