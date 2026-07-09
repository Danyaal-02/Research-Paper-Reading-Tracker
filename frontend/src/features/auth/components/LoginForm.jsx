import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authValidation.js";
import useLoginMutation from "../hooks/useLoginMutation.js";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import { LogIn } from "lucide-react";

const LoginForm = ({ onToggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useLoginMutation();

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold gradient-text mb-1">Welcome Back</h2>
        <p className="text-sm text-surface-400">
          Sign in to continue tracking your research
        </p>
      </div>

      <Input
        id="login-email"
        label="Email"
        type="email"
        placeholder="you@university.edu"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        id="login-password"
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" loading={loginMutation.isPending} className="w-full mt-1">
        <LogIn size={16} />
        Sign In
      </Button>

      <p className="text-center text-sm text-surface-400">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Create one
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
