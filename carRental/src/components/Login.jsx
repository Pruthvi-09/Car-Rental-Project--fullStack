import React from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const {setShowLogin,axios,setToken,navigate,fetchUser}=useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [countryCode, setCountryCode] = React.useState("+91");
    const [showPassword, setShowPassword] = React.useState(false);

    // const onSubmitHandler = async (event)=>{
    //  try {
    //      event.preventDefault();
    //      const {data}= await axios.post(`/api/user/${state}`, {name,email,password})

    //      if(data.success){
    //         navigate('/')
    //         setToken(data.token)
    //         localStorage.setItem('token', data.token)
    //         setShowLogin(false)
    //      }
    //      else{
    //         toast.error(data.message)
    //      }
        
    //  } catch (error) {
    //       toast.error(error.message)
        
    //  }
    // }

const onSubmitHandler = async (event) => {
  try {
    event.preventDefault();

    // Validation for registration
    if (state === "register") {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Phone validation (optional but if provided, must be valid)
      if (phone && phone.trim() !== "") {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
          toast.error("Phone number must be 10 digits");
          return;
        }
      }

      // Password validation
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(password)) {
        toast.error("Password must contain uppercase, lowercase, and number");
        return;
      }
    }

    const { data } = await axios.post(`/api/user/${state}`, {
      name,
      email,
      password,
      phone: phone.trim() ? `${countryCode}${phone.trim()}` : '',
    });

    if (data.success) {

      // 👉 Save token to localStorage first
      localStorage.setItem("token", data.token);

      // 👉 Set token for ALL axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // 👉 Set token in state (this will trigger useEffect in AppContext to fetch user)
      setToken(data.token);

      // 👉 Close login popup
      setShowLogin(false);

      toast.success(state === "register" ? "Account created successfully!" : "Login successful!");
      navigate("/");

    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};



  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={()=> setShowLogin(false)} 
      className='fixed inset-0 z-[9999] flex items-center justify-center text-sm text-gray-600 bg-black/60 backdrop-blur-sm'
    >
        <motion.form 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onSubmit={onSubmitHandler} 
          onClick={(e)=> e.stopPropagation()} 
          className="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-2xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
        >

            <p className="text-2xl font-medium m-auto text-gray-800 dark:text-white">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>

            {state === "register" && (
                <>
                  <div className="w-full">
                      <p className="text-gray-700 dark:text-gray-300">Name</p>
                      <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter your name" className="border border-gray-200 dark:border-gray-600 rounded w-full p-2 mt-1 bg-white dark:bg-gray-700 dark:text-white outline-primary" type="text" required />
                  </div>
                  <div className="w-full">
                      <p className="text-gray-700 dark:text-gray-300">Phone Number (Optional)</p>
                      <div className="flex gap-2">
                        <select 
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="border border-gray-200 dark:border-gray-600 rounded p-2 mt-1 bg-white dark:bg-gray-700 dark:text-white outline-primary w-24"
                        >
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+61">🇦🇺 +61</option>
                          <option value="+971">🇦🇪 +971</option>
                          <option value="+86">🇨🇳 +86</option>
                        </select>
                        <input 
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                          value={phone} 
                          placeholder="10 digit number" 
                          className="flex-1 border border-gray-200 dark:border-gray-600 rounded p-2 mt-1 bg-white dark:bg-gray-700 dark:text-white outline-primary" 
                          type="tel"
                          maxLength={10}
                        />
                      </div>
                      {phone && phone.length > 0 && phone.length !== 10 && (
                        <p className="text-xs text-red-500 mt-1">Phone must be exactly 10 digits</p>
                      )}
                      {phone && phone.length === 10 && (
                        <p className="text-xs text-green-600 mt-1">✓ {countryCode} {phone}</p>
                      )}
                  </div>
                </>
            )}
            <div className="w-full ">
                <p className="text-gray-700 dark:text-gray-300">Email</p>
                <input 
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                  placeholder="example@email.com" 
                  className="border border-gray-200 dark:border-gray-600 rounded w-full p-2 mt-1 bg-white dark:bg-gray-700 dark:text-white outline-primary" 
                  type="email" 
                  required 
                />
            </div>
            <div className="w-full ">
                <p className="text-gray-700 dark:text-gray-300">Password</p>
                <div className="relative">
                  <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    placeholder="Min 8 chars with A-Z, a-z, 0-9" 
                    className="border border-gray-200 dark:border-gray-600 rounded w-full p-2 mt-1 pr-10 bg-white dark:bg-gray-700 dark:text-white outline-primary" 
                    type={showPassword ? "text" : "password"} 
                    minLength={8}
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 mt-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {state === "register" && password.length > 0 && (
                  <div className="text-xs mt-1 space-y-0.5">
                    {password.length < 8 && (
                      <p className="text-red-500">• At least 8 characters</p>
                    )}
                    {!/[A-Z]/.test(password) && (
                      <p className="text-red-500">• One uppercase letter</p>
                    )}
                    {!/[a-z]/.test(password) && (
                      <p className="text-red-500">• One lowercase letter</p>
                    )}
                    {!/[0-9]/.test(password) && (
                      <p className="text-red-500">• One number</p>
                    )}
                  </div>
                )}
            </div>

            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer"
            >
                {state === "register" ? "Create Account" : "Login"}
            </motion.button>
        </motion.form>


    </motion.div>
  )
}

export default Login