export const signupValidation = {
  email: (value) => {
    if (!value) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email address";
    return null;
  },

  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  },

  confirmPassword: (value, formData) => {
    if (!value) return "Confirm password is required";
    if (value !== formData.password) return "Passwords do not match";
    return null;
  },
};