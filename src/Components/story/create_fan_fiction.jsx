import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateFanFiction() {
  const { storyid } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${storyid}`);
        if (!response.ok) throw new Error("Failed to fetch story");
        const storyData = await response.json();
        setValue("title", storyData.title);
        setValue("description", storyData.description);
        setValue("content", storyData.content);
      } catch (error) {
        setMessage("Error loading story data.");
      }
    };

    if (storyid) {
      fetchStory();
    }
  }, [storyid, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!username || !token) {
      setMessage("Authentication error. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-story`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          content: data.content,
          author: username,
          sourceStory: storyid,
        }),
      });
      console.log(storyid);

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      setMessage("Failed to publish the story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drop-shadow-2xl bg-background flex justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Your Story</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 5, message: "Min length is 5" },
                maxLength: { value: 100, message: "Max length is 100" },
              })}
              className="w-full p-3 border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-primary"
              placeholder="Enter your story title..."
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: { value: 20, message: "Min length is 20" },
              })}
              className="w-full p-3 border-gray-300 rounded-lg mt-2 h-24 focus:ring-2 focus:ring-primary"
              placeholder="Write a description..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium">Story Content</label>
            <textarea
              {...register("content", {
                required: "Story content is required",
                minLength: { value: 400, message: "Min length is 400" },
              })}
              className="w-full p-3 border-gray-300 rounded-lg mt-2 h-64"
              placeholder="Write your story here..."
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-black px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-300 transition"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Story"}
            </button>
          </div>
        </form>

        {message && <p className="text-center mt-4 text-lg font-semibold text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
