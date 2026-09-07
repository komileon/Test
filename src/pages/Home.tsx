import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {/* Home */}
      <div className="flex items-center gap-8">
        <button
          className="bg-red-500 text-white px-2 py-1 rounded-sm cursor-pointer"
          onClick={() => navigate("test")}
        >
          Test
        </button>
        <button
          className="bg-black text-white px-2 py-1 rounded-sm cursor-pointer"
          onClick={() => navigate("editing/saved")}
        >
          Editing
        </button>
      </div>
    </div>
  );
};

export default Home;
