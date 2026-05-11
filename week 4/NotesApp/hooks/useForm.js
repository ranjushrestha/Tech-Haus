import { useState } from "react";

const useForm = (initialValue, validation, onPress) => {
  const [formData, setFormData] = useState(initialValue);
  const [errors, setErrors] = useState({});

  const handleChange = (value, fieldName) => {
    const updatedFormData = {
      ...formData,
      [fieldName]: value,
    };

    setFormData(updatedFormData);

    const fieldError = validation[fieldName](
      value,
      updatedFormData
    );

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: fieldError,
    }));
  };

  const checkValidation = () => {
    let formErrors = {};

    for (const key in validation) {
      const error = validation[key](formData[key], formData);

      if (error) {
        formErrors[key] = error;
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = () => {
    const isValid = checkValidation();

    if (isValid) {
      onPress(formData);
      setFormData(initialValue);
      setErrors({});
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
  };
};

export default useForm;