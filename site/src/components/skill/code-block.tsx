import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
}

export const CodeBlock = ({ code, className }: CodeBlockProps) => (
  <pre
    className={cn(
      "overflow-x-auto rounded-[28px] bg-zinc-950 px-5 py-4 text-sm leading-7 text-zinc-100 shadow-sm",
      className,
    )}
  >
    <code>{code}</code>
  </pre>
);
