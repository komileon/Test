import { ArrowLeft } from "lucide-react";
import Forms from "../components/Forms";
import MessageBox from "../components/MessageBox";
import { useNavigate } from "react-router";

const Test = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-black w-full min-h-screen text-white flex flex-col gap-6">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-10 w-max cursor-pointer"
      >
        <ArrowLeft />
      </button>
      <MessageBox>
        <Forms />
      </MessageBox>
    </div>
  );
};

export default Test;
