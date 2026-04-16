import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ContentPanelProps {
  title: string;
  children: ReactNode;
  eyebrow?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
}

export const ContentPanel = ({
  title,
  children,
  eyebrow,
  description,
  className,
  headerClassName,
  contentClassName,
  titleClassName,
}: ContentPanelProps) => (
  <Card className={cn("powerup-content-panel py-0", className)}>
    <CardHeader className={cn("powerup-content-panel-header", headerClassName)}>
      {eyebrow ? <p className="powerup-eyebrow">{eyebrow}</p> : null}
      <div className="space-y-2">
        <CardTitle className={cn("text-xl text-[var(--powerup-ink-title)] sm:text-[1.65rem]", titleClassName)}>
          {title}
        </CardTitle>
        {description ? <p className="powerup-panel-description">{description}</p> : null}
      </div>
    </CardHeader>
    <CardContent className={cn("powerup-content-panel-body", contentClassName)}>
      {children}
    </CardContent>
  </Card>
);
