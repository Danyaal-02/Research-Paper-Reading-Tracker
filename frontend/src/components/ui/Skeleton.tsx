import { cn } from "../../utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "circle" | "text";
}

export const Skeleton = ({ variant = "rect", className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-surface-700/50",
        variant === "circle" && "rounded-full",
        variant === "text" && "rounded",
        variant === "rect" && "rounded-md",
        className
      )}
      {...props}
    />
  );
};
