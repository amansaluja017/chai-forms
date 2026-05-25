"use client";

import * as React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { Button } from "~/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full relative overflow-hidden"
      onClick={toggleTheme}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <IconSun className="absolute h-[1.3rem] w-[1.3rem] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] rotate-0 scale-100 opacity-100 dark:-rotate-180 dark:scale-50 dark:opacity-0 text-amber-500" />
        <IconMoon className="absolute h-[1.3rem] w-[1.3rem] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] rotate-180 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100 text-sky-400" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
