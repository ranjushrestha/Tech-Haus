
 export const validation = (name, value) => {
  const errors = {};

  switch (name) {
    case "username":
      if (!value.trim()) errors.username = "username is required";
      else if (value.length < 2)
        errors.username = "Username must be at least two character";
      break;
    case "email":
      if (!value.trim()) errors.email = "email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        errors.email = "Enter a valid email";
      break;
    case "password": 
    if(!value.trim()) errors.password = "Password is required"
    else if (value.length < 8)
        errors.password = "Password must be atleast 8 character"
    break

    default:
        break
  }
return errors
};
