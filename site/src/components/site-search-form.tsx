import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SiteSearchFormProps {
  inputId: string;
  action?: string;
  buttonLabel?: string;
  compact?: boolean;
  variant?: "default" | "hero";
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export const SiteSearchForm = ({
  inputId,
  action = "/",
  buttonLabel = "搜索",
  compact = false,
  variant = "default",
  defaultValue,
  placeholder = "搜索 Skill、MCP、标签或描述",
  className,
}: SiteSearchFormProps) => {
  const heroVariant = !compact && variant === "hero";

  return (
    <form
      action={action}
      method="get"
      className={cn(
        compact
          ? "grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-stretch"
          : "flex w-full flex-col gap-3 sm:flex-row sm:items-center",
        heroVariant && "powerup-search-form-hero",
        className,
      )}
      role="search"
    >
      <label className="sr-only" htmlFor={inputId}>
        搜索 PowerUp
      </label>
      <div
        className={cn(
          "relative flex-1",
          compact &&
            "flex items-center gap-2 rounded-[20px] border border-white/80 bg-white/84 px-3 shadow-[0_10px_20px_rgba(122,86,109,0.08)] backdrop-blur",
        )}
      >
        <Search
          className={cn(
            "pointer-events-none size-4 text-zinc-400",
            compact
              ? "shrink-0 text-[#ef6d56]"
              : "absolute top-1/2 left-3.5 -translate-y-1/2",
          )}
        />
        <Input
          id={inputId}
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={cn(
            compact
              ? "h-[52px] rounded-none border-0 bg-transparent px-0 pr-1 text-[0.95rem] text-[var(--powerup-ink-input)] shadow-none focus-visible:border-0 focus-visible:ring-0"
              : heroVariant
                ? "h-14 w-full rounded-[24px] border-white/75 bg-white/92 pr-4 pl-11 text-base text-[var(--powerup-ink-input)] shadow-[0_14px_30px_rgba(122,86,109,0.12)] focus-visible:border-[#ff8d73] focus-visible:ring-[#ffd8cf]"
                : "h-12 w-full rounded-2xl border-zinc-200 bg-white/90 pr-4 pl-10 text-base text-[var(--powerup-ink-input)] shadow-sm focus-visible:border-amber-400 focus-visible:ring-amber-100",
          )}
        />
      </div>
      <Button
        type="submit"
        size={compact ? "default" : "lg"}
        className={cn(
          compact
            ? "h-[52px] rounded-[20px] border-0 bg-[linear-gradient(180deg,#ff7b63,#ef5256)] px-6 text-white shadow-[inset_0_-5px_0_rgba(0,0,0,0.16),inset_0_2px_0_rgba(255,255,255,0.38),0_12px_22px_rgba(239,82,86,0.24)] hover:brightness-105"
            : heroVariant
              ? "powerup-button-primary h-14 px-6 text-base"
              : "h-12 rounded-2xl bg-zinc-950 px-5 text-white hover:bg-zinc-800",
        )}
      >
        {buttonLabel}
      </Button>
    </form>
  );
};
