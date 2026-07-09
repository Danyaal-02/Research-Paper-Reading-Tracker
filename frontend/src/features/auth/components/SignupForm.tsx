import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "../schemas/authValidation.ts";
import useSignupMutation from "../hooks/useSignupMutation.ts";
import Input from "../../../components/ui/Input.tsx";
import Button from "../../../components/ui/Button.tsx";
import { UserPlus } from "lucide-react";

interface SignupFormProps {
  onToggle: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const signupMutation = useSignupMutation();

  const onSubmit = (data: SignupFormData) => {
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
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
