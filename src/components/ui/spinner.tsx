import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Icon
      aria-label="Loading"
      className={cn("animate-spin", className)}
      name="Spinner"
      role="status"
      size={16}
      {...props}
    />
  );
}

export { Spinner };
