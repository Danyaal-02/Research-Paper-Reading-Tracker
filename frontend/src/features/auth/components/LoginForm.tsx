import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schemas/authValidation.ts";
import useLoginMutation from "../hooks/useLoginMutation.ts";
import Input from "../../../components/ui/Input.tsx";
import Button from "../../../components/ui/Button.tsx";
import { LogIn } from "lucide-react";
import { AUTH_STRINGS } from "../constants.ts";

interface LoginFormProps {
  onToggle: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold gradient-text mb-1">{AUTH_STRINGS.WELCOME_BACK}</h2>
        <p className="text-sm text-surface-400">
          {AUTH_STRINGS.SIGN_IN_SUBTITLE}
        </p>
      </div>

      <Input
        id="login-email"
        label="Email"
        type="email"
        placeholder={AUTH_STRINGS.EMAIL_PLACEHOLDER}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        id="login-password"
        label="Password"
        type="password"
        placeholder={AUTH_STRINGS.PASSWORD_PLACEHOLDER}
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" loading={loginMutation.isPending} className="w-full mt-1">
        {loginMutation.isPending ? (
          "Signing in..."
        ) : (
          <>
            <LogIn size={16} />
            Sign In
          </>
        )}
      </Button>

      <p className="text-center text-sm text-surface-400">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors cursor-pointer"
        >
          Create one
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
