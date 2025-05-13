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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${isLogin ? "login" : "register"}`, {
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