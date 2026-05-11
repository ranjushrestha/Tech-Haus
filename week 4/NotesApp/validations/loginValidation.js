export const loginValidation = {
    email:(value) => {
        if(!value) return 'Email is required'
        if(!/\S+@\S+\.\S+/.test(value)) return 'Invalid email address'
        return null
    },
    password: (value) => {
        if(!value) return 'Password is required'
        if(value.length < 6) return  "Password must be at least 6 characters";
        // for authentication
    }
}