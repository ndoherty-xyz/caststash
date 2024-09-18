import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-stone-600/10 dark:bg-stone-50/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
