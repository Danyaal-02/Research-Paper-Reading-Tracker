import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/authValidation.js";
import useSignupMutation from "../hooks/useSignupMutation.js";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import { UserPlus } from "lucide-react";

const SignupForm = ({ onToggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const signupMutation = useSignupMutation();

  const onSubmit = (data) => {
    signupMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold gradient-text mb-1">Create Account</h2>
        <p className="text-sm text-surface-400">
          Start tracking your research reading journey
        </p>
      </div>

      <Input
        id="signup-email"
        label="Email"
        type="email"
        placeholder="you@university.edu"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        id="signup-password"
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        id="signup-confirm"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" loading={signupMutation.isPending} className="w-full mt-1">
        <UserPlus size={16} />
        Create Account
      </Button>

      <p className="text-center text-sm text-surface-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
