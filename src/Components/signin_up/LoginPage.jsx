// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbaar from '../Landing Page/Navbaar';

// export default function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true);
//   const navigate = useNavigate();

//   const handleRegister = async () => {
//     const name = document.querySelector('#name')?.value;
//     const username = document.querySelector('#username').value;
//     const password = document.querySelector('#password').value;

//     // Validation
//     if (name.length < 2 || name.length > 21) {
//       alert("Name should be between 2 and 21 characters.");
//       return;
//     }

//     const usernameRegex = /^[a-zA-Z0-9_]+$/; // No special characters
//     if (!usernameRegex.test(username)) {
//       alert("Username should not contain special characters.");
//       return;
//     }

//     // Password validation (min 8 chars, max 16, and must have uppercase, lowercase, number, and special char)
//     const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;
//     if (!passwordRegex.test(password)) {
//       alert("Password should be between 8-16 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
//       return;
//     }

//     // If all validations pass, proceed with the registration
//     try {
//       const response = await fetch('http://localhost:3000/api/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, username, password }),
//       });

//       const data = await response.json();
//       alert(data.message);
//     } catch (error) {
//       console.error('Error during registration:', error);
//       alert('Error during registration. Please try again.');
//     }
//   };

//   const handleLogin = async () => {
//     const username = document.querySelector('#username').value;
//     const password = document.querySelector('#password').value;

//     // Login validation (ensure no empty fields)
//     if (!username || !password) {
//       alert("Please enter both username and password.");
//       return;
//     }
//     // If validations pass, proceed with the login
//     try {
//       const response = await fetch('http://localhost:3000/api/login', {
//         method: 'POST',
//         headers: {
//           "Content-Type": "application/json", // Specify JSON format
//         },
//         body: JSON.stringify({ username, password }),
//       });


//       const data = await response.json();
//       if (data.token) {
//         localStorage.setItem('token', data.token);
//         alert(data.message);
//         navigate(`/${username}`);
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       alert('Error during login. Please try again.');
//     }
//   };

//   return (
//     <>
//       <div className="flex h-screen">
//         {/* Left Side - Authentication Form */}
//         <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
//           <h1 className="text-3xl font-bold">Welcome to StoryMosaic</h1>
//           <p className="text-gray-500 mt-2">
//             Join our community of storytellers and readers
//           </p>

//           {/* Toggle Login/Register */}
//           <div className="mt-6 flex space-x-4">
//             <button className={`px-4 py-2 rounded-md ${isLogin ? "bg-gray-200" : "bg-white border"}`} onClick={() => setIsLogin(true)}>
//               Login
//             </button>
//             <button className={`px-4 py-2 rounded-md ${!isLogin ? "bg-gray-200" : "bg-white border"}`} onClick={() => setIsLogin(false)}>
//               Register
//             </button>
//           </div>

//           {/* Form */}
//           <div className="mt-6 w-80">
//             <div className={isLogin ? "hidden" : "block"}>
//               <label className="block text-gray-600 text-sm">Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter Your Good Name"
//                 id='name'
//                 className="w-full px-3 py-2 border rounded-md mt-1"
//               />
//             </div>

//             <label className="block text-gray-600 text-sm mt-4">Username</label>
//             <input
//               type="text"
//               placeholder="Enter username"
//               id='username'
//               className="w-full px-3 py-2 border rounded-md mt-1"
//             />

//             <label className="block text-gray-600 text-sm mt-4">Password</label>
//             <input
//               type="password"
//               placeholder="Enter password"
//               id='password'
//               className="w-full px-3 py-2 border rounded-md mt-1"
//             />

//             <button onClick={handleLogin} className={`w-full bg-blue-600 text-white py-2 rounded-md mt-6 ${!isLogin ? "hidden" : "block"}`}>
//               Log in
//             </button>
//             <button onClick={handleRegister} className={`w-full bg-blue-600 text-white py-2 rounded-md mt-6 ${isLogin ? "hidden" : "block"}`}>
//               Sign Up
//             </button>
//           </div>
//         </div>

//         {/* Right Side - Information */}
//         <div className="w-1/2 flex flex-col justify-center bg-gray-100 p-10">
//           <h2 className="text-2xl font-semibold">Your Stories, Your Voice</h2>

//           <div className="mt-6 space-y-4">
//             <div className="flex items-center space-x-3">
//               <span className="text-blue-600 text-xl">📝</span>
//               <div>
//                 <h3 className="font-semibold">For Authors</h3>
//                 <p className="text-gray-500 text-sm">
//                   Share your stories with a global audience and build your author
//                   platform.
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <span className="text-blue-600 text-xl">👥</span>
//               <div>
//                 <h3 className="font-semibold">For Editors</h3>
//                 <p className="text-gray-500 text-sm">
//                   Discover new talent and help shape the next bestseller.
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <span className="text-blue-600 text-xl">📖</span>
//               <div>
//                 <h3 className="font-semibold">For Readers</h3>
//                 <p className="text-gray-500 text-sm">
//                   Explore unique stories from diverse voices around the world.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import { useForm } from "react-hook-form";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true);
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setError,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     const { name, username, password } = data;

//     if (!isLogin && (name.length < 2 || name.length > 21)) {
//       setError("name", { message: "Name should be between 2 and 21 characters." });
//       return;
//     }

//     if (!isLogin) {
//       try {
//         const response = await fetch("http://localhost:3000/api/register", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name, username, password }),
//         });

//         const resData = await response.json();
//         alert(resData.message);
//       } catch (error) {
//         console.error("Error during registration:", error);
//         alert("Error during registration. Please try again.");
//       }
//     } else {
//       try {
//         const response = await fetch("http://localhost:3000/api/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, password }),
//         });

//         const resData = await response.json();
//         if (resData.token) {
//           localStorage.setItem("token", resData.token);
//           alert(resData.message);
//           navigate(`/user/${username}`);
//           window.location.reload();
//         } else {
//           alert(resData.message);
//         }
//       } catch (error) {
//         console.error("Error during login:", error);
//         alert("Error during login. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Left Side - Authentication Form */}
//       <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
//         <h1 className="text-3xl font-bold">Welcome to StoryMosaic</h1>
//         <p className="text-gray-500 mt-2">Join our community of storytellers and readers</p>

//         {/* Toggle Login/Register */}
//         <div className="mt-6 flex space-x-4">
//           <button
//             className={`px-4 py-2 rounded-md ${isLogin ? "bg-gray-200" : "bg-white border"}`}
//             onClick={() => setIsLogin(true)}
//           >
//             Login
//           </button>
//           <button
//             className={`px-4 py-2 rounded-md ${!isLogin ? "bg-gray-200" : "bg-white border"}`}
//             onClick={() => setIsLogin(false)}
//           >
//             Register
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-80">
//           {!isLogin && (
//             <>
//               <label className="block text-gray-600 text-sm">Name</label>
//               <input
//                 {...register("name", { required: "Name is required", minLength: { value: 2, message: "At least 2 characters" }, maxLength: { value: 20, message: "Max 21 characters" } })}
//                 className="w-full px-3 py-2 border rounded-md mt-1"
//                 placeholder="Enter Your Name"
//               />
//               {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//             </>
//           )}

//           <label className="block text-gray-600 text-sm mt-4">Username</label>
//           <input
//             type="text"
//             {...register("username", { required: "Username is required", minLength: { value: 5, message: "At least 5 characters" }, pattern: { value: /^[a-z0-9_]+$/, message: "No special characters allowed" } })}
//             placeholder="Enter username"
//             className="w-full px-3 py-2 border rounded-md mt-1"
//           />
//           {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

//           <label className="block text-gray-600 text-sm mt-4">Password</label>
//           <input
//             type="password"
//             {...register("password", {
//               required: "Password is required",
//               minLength: { value: 8, message: "Minimum 8 characters" },
//               maxLength: { value: 16, message: "Maximum 16 characters" },
//               pattern: {
//                 value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/,
//                 message: "Must include uppercase, lowercase, number, and special character",
//               },
//             })}
//             placeholder="Enter password"
//             className="w-full px-3 py-2 border rounded-md mt-1"
//           />
//           {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

//           <button
//             type="submit"
//             className={`w-full bg-blue-600 text-white py-2 rounded-md mt-6 ${!isLogin ? "hidden" : "block"}`}
//           >
//             Log in
//           </button>
//           <button
//             type="submit"
//             className={`w-full bg-blue-600 text-white py-2 rounded-md mt-6 ${isLogin ? "hidden" : "block"}`}
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>

//       {/* Right Side - Information */}
//       <div className="w-1/2 flex flex-col justify-center bg-gray-100 p-10">
//         <h2 className="text-2xl font-semibold">Your Stories, Your Voice</h2>

//         <div className="mt-6 space-y-4">
//           <div className="flex items-center space-x-3">
//             <span className="text-blue-600 text-xl">📝</span>
//             <div>
//               <h3 className="font-semibold">For Authors</h3>
//               <p className="text-gray-500 text-sm">
//                 Share your stories with a global audience and build your author platform.
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3">
//             <span className="text-blue-600 text-xl">👥</span>
//             <div>
//               <h3 className="font-semibold">For Editors</h3>
//               <p className="text-gray-500 text-sm">Discover new talent and help shape the next bestseller.</p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3">
//             <span className="text-blue-600 text-xl">📖</span>
//             <div>
//               <h3 className="font-semibold">For Readers</h3>
//               <p className="text-gray-500 text-sm">
//                 Explore unique stories from diverse voices around the world.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, username, password } = data;

    if (!isLogin && (name.length < 2 || name.length > 21)) {
      setError("name", { message: "Name should be between 2 and 21 characters." });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/${isLogin ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin ? { username, password } : { name, username, password }),
      });
      
      const resData = await response.json();
      alert(resData.message);
      
      if (isLogin && resData.token) {
        localStorage.setItem("token", resData.token);
        navigate(`/user/${username}`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("Some error occured. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <h1 className="text-3xl font-bold">Welcome to StoryMosaic</h1>
        <p className="text-gray-500 mt-2">Join our community of storytellers and readers</p>
        
        <div className="mt-6 flex space-x-4">
          <button className={`px-4 py-2 rounded-md ${isLogin ? "bg-gray-200" : "bg-white border"}`} onClick={() => setIsLogin(true)}>Login</button>
          <button className={`px-4 py-2 rounded-md ${!isLogin ? "bg-gray-200" : "bg-white border"}`} onClick={() => setIsLogin(false)}>Register</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-80">
          {!isLogin && (
            <>
              <label className="block text-gray-600 text-sm">Name</label>
              <input {...register("name", { required: "Name is required", minLength: { value: 2, message: "At least 2 characters" }, maxLength: { value: 20, message: "Max 21 characters" } })} className="w-full px-3 py-2 border rounded-md mt-1" placeholder="Enter Your Name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </>
          )}

          <label className="block text-gray-600 text-sm mt-4">Username</label>
          <input {...register("username", { required: "Username is required", minLength: { value: 5, message: "At least 5 characters" }, pattern: { value: /^[a-z0-9_]+$/, message: "No special characters allowed" } })} className="w-full px-3 py-2 border rounded-md mt-1" placeholder="Enter username" />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

          <label className="block text-gray-600 text-sm mt-4">Password</label>
          <div className="relative w-full">
            <input type={showPassword ? "text" : "password"} {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" }, maxLength: { value: 16, message: "Maximum 16 characters" }, pattern: { value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/, message: "Must include uppercase, lowercase, number, and special character" } })} className="w-full px-3 py-2 border rounded-md mt-1" placeholder="Enter password" />
            <button type="button" className="absolute right-3 top-3 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md mt-6">{isLogin ? "Log in" : "Sign Up"}</button>
        </form>
      </div>

      <div className="w-1/2 flex flex-col justify-center bg-gray-100 p-10">
        <h2 className="text-2xl font-semibold">Your Stories, Your Voice</h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-blue-600 text-xl">📝</span>
            <div>
              <h3 className="font-semibold">For Authors</h3>
              <p className="text-gray-500 text-sm">Share your stories with a global audience and build your author platform.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-blue-600 text-xl">👥</span>
            <div>
              <h3 className="font-semibold">For Editors</h3>
              <p className="text-gray-500 text-sm">Discover new talent and help shape the next bestseller.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-blue-600 text-xl">📖</span>
            <div>
              <h3 className="font-semibold">For Readers</h3>
              <p className="text-gray-500 text-sm">Explore unique stories from diverse voices around the world.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}