// import React from 'react'

import { PenBoxIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import BlogList from "../components/BlogList";
import type { BlogData } from "../types/blog.types";

const EditingHomePage = () => {
  const response = window.localStorage.getItem("BLOG_DATA");

  const blog: Record<string, BlogData> = response ? JSON.parse(response) : {};

  console.log(Object.keys(blog).length === 0 ? "red" : blog);

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col gap-16">
      <div className="w-full h-15 border-b border-b-neutral-100 flex items-center justify-between px-16">
        <div>
          <span className="text-3xl">Minidium</span>
        </div>
        <div>
          <button
            className="flex items-center gap-1 px-2 py-1 bg-black text-white text-sm rounded-sm cursor-pointer"
            onClick={() => {
              const id = uuidv4();
              navigate(`/editing/p/${id}/edit`);
            }}
          >
            <span>Write</span>
            <PenBoxIcon size={14} />
          </button>
        </div>
      </div>

      <div className="w-1/2 mx-auto">
        {Object.keys(blog).length === 0 ? (
          <span>No blogs saved</span>
        ) : (
          <BlogList blog={blog} />
        )}
      </div>
    </div>
  );
};

export default EditingHomePage;
