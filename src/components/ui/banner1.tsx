"use client";

import { Icon } from "@/components/common/Icon";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Banner1Props = {
  title?: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
  defaultVisible?: boolean;
};

const Banner1 = ({
  title,
  description = "Read the full release notes",
  linkText = "here",
  linkUrl,
  defaultVisible = true,
}: Banner1Props) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <section className="w-full border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 text-center">
          <span className="text-sm">
            {title && <span className="font-medium">{title} </span>}
            <span className="text-muted-foreground">
              {description}
              {linkUrl && linkText && (
                <>
                  {" "}
                  <a
                    className="underline underline-offset-2 hover:text-foreground"
                    href={linkUrl}
                    {...(linkUrl.startsWith("http") && {
                      rel: "noopener",
                      target: "_blank",
                    })}
                  >
                    {linkText}
                  </a>
                  .
                </>
              )}
            </span>
          </span>
        </div>

        <Button
          className="-mr-2 h-8 w-8 flex-none"
          onClick={handleClose}
          size="icon"
          variant="ghost"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
    </section>
  );
};

export { Banner1 };
