import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Blog } from "../types/blog.type";

interface BlogState {
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
  addBlog: (blog: Blog) => void;
  updateBlog: (blog: Blog) => void;
  deleteBlog: (id: number) => void;
  clearBlogs: () => void;
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      blogs: [],

      setBlogs: (blogs) => set({ blogs }),

      addBlog: (blog) => {
        set((state) => ({ blogs: [blog, ...state.blogs] }));
      },

      updateBlog: (blog) => {
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === blog.id ? blog : b)),
        }));
      },

      deleteBlog: (id) => {
        set((state) => ({
          blogs: state.blogs.filter((b) => b.id !== id),
        }));
      },

      clearBlogs: () => {
        set({ blogs: [] });
      },
    }),
    {
      name: "blog-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
