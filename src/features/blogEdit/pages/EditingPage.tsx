import { useEffect } from "react";
import EditBox from "../components/EditBox";
import type { BNode, BlogData } from "../types/blog.types";
import EditPreview from "../components/EditPreview";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate, useParams } from "react-router";
import { CleanFields } from "../utils/blog.utils";

const EditingPage = () => {
  // const [fields, setFields] = useState<BNode[]>([])
  const { id } = useParams();
  const [fields, setFields, removeFields] = useLocalStorage<BNode[]>(
    "EDIT",
    [],
  );
  const [isPreview, setIsPreview, removePreview] = useLocalStorage<boolean>(
    "IS_PREVIEW",
    false,
  );
  const [, setBlogList] = useLocalStorage<Record<string, BlogData>>(
    "BLOG_DATA",
    {},
  );
  const navigate = useNavigate();

  console.log(id);

  useEffect(() => {
    document.title = "Editing Story";
  }, []);

  const handleSave = () => {
    if (id) {
      setBlogList((prev) => {
        const newMap = {
          ...prev,
          [id]: {
            id,
            nodes: CleanFields(fields),
            update_at: new Date(),
          },
        };
        console.log("new Prev: ", newMap);
        return newMap;
      });
      removeFields();
      removePreview();
      navigate("/editing/saved");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-zinc-100 pb-80">
      <div className="w-full md:w-3/4 xl:w-3/5 2xl:w-1/2 min-h-15 px-8 mx-auto flex items-center justify-between">
        <div className="my-8">
          <span className="text-3xl">Minidium</span>
        </div>
        <div>
          {isPreview && (
            <button
              onClick={handleSave}
              className="text-sm cursor-pointer outline-0 border-0 flex-1 transition-all duration-300 bg-black text-white px-4 py-1 rounded-sm hover:bg-black/90"
            >
              Save and go Home
            </button>
          )}
        </div>
      </div>
      <div className="w-4/5 md:w-3/5 xl:w-1/2 2xl:w-2/5 min-h-15 mx-auto flex flex-col">
        <div className="w-40 h-8 ml-auto flex border border-gray-300 rounded-sm overflow-hidden">
          <button
            onClick={() => {
              setIsPreview(false);
              //   console.log(isPreview);
            }}
            className={`text-sm cursor-pointer outline-0 border-0 flex-1 transition-all duration-300 ${!isPreview ? "bg-black text-white" : ""}`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`text-sm cursor-pointer outline-0 border-0 flex-1 transition-all duration-300 ${isPreview ? "bg-black text-white" : ""}`}
          >
            Preview
          </button>
        </div>
      </div>
      {isPreview ? (
        <EditPreview fields={fields} />
      ) : (
        <EditBox
          initialFields={fields}
          onChange={(f) => {
            setFields(f);
          }}
        />
      )}
    </div>
  );
};

export default EditingPage;
