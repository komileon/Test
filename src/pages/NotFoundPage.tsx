import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <span className="text-4xl">Page Not Found</span>
      <button
        className="bg-black text-white rounded-sm px-2 py-1"
        onClick={() => navigate("/")}
      >
        Retour à l'acceuil
      </button>
    </div>
  );
};

export default NotFoundPage;
