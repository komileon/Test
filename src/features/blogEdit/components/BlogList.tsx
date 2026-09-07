import { CalendarDaysIcon, Trash2Icon } from "lucide-react";
import type { BlogData } from "../types/blog.types";

const BlogList = ({ blog }: { blog: Record<string, BlogData> }) => {
  console.log(blog);

  // const red = (data: BlogData) => {
  //   const id = data.id;
  //   const node = data.nodes;
  //   const date = data.update_at;
  //   return { id, title, text, date };
  // };

  // const display = (item: Record<string, BlogData>) => {
  //   return [];
  // };

  return (
    <div className="flex flex-col gap-8">
      <List />
      <List />
      <List />
    </div>
  );
};

export default BlogList;

function List() {
  return (
    <div className="w-full h-35 pb-2 overflow-hidden flex flex-col gap-2 border-b border-b-gray-300 hover:border-b-gray-500 transition-all duration-200">
      <div className="w-full h-full flex gap-2">
        <div className="flex-1">
          <h2 className="text-4xl font-semibold cursor-pointer inline-block">
            Title
          </h2>
          <div className="line-clamp-2 text-sm text-zinc-800 leading-tight">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
            corrupti ex quis sit eligendi saepe at temporibus, error ab
            molestias consectetur excepturi explicabo reprehenderit quae
            asperiores eos id soluta delectus?
          </div>
        </div>
        <div className="w-1/4 h-full bg-blue-400 flex items-center justify-center">
          image
        </div>
      </div>
      <div className="w-full flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-neutral-800">
          <CalendarDaysIcon size={14} />
          <span>Jun 06, 2020</span>
        </div>
        <div className="hidden">
          <button className="text-red-400">
            <Trash2Icon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
