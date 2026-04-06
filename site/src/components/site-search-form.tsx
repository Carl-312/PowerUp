import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SiteSearchFormProps {
  inputId: string;
  action?: string;
  buttonLabel?: string;
  compact?: boolean;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export const SiteSearchForm = ({
  inputId,
  action = "/",
  buttonLabel = "搜索",
  compact = false,
  defaultValue,
  placeholder = "搜索 Skill、MCP、标签或描述",
  className,
}: SiteSearchFormProps) => (
  <form
    action={action}
    method="get"
    className={cn(
      "flex w-full flex-col gap-3 sm:flex-row sm:items-center",
      compact && "gap-2 sm:min-w-[320px]",
      className,
    )}
    role="search"
  >
    <label className="sr-only" htmlFor={inputId}>
      搜索 PowerUp
    </label>
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400" />
      <Input
        id={inputId}
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl border-zinc-200 bg-white/90 pr-4 pl-10 text-zinc-900 shadow-sm focus-visible:border-amber-400 focus-visible:ring-amber-100",
          compact ? "h-10 text-sm" : "h-12 text-base",
        )}
      />
    </div>
    <Button
      type="submit"
      size={compact ? "default" : "lg"}
      className={cn(
        "rounded-2xl bg-zinc-950 px-5 text-white hover:bg-zinc-800",
        !compact && "h-12",
      )}
    >
      {buttonLabel}
    </Button>
  </form>
);
