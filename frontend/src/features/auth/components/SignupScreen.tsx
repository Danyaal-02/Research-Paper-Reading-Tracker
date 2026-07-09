import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import SignupForm from "./SignupForm.tsx";

const SignupScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-8 w-full animate-scale-in relative z-10">
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center animate-pulse-glow">
          <BookOpen size={28} className="text-white" />
        </div>
      </div>
      <SignupForm onToggle={() => navigate("/login")} />
    </div>
  );
};

export default SignupScreen;
