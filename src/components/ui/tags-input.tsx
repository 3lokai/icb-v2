// src/components/ui/tags-input.tsx
"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "../common/Icon";

export interface LookupOption {
  value: string;
  label: string;
}

interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions?: LookupOption[];
  popularSuggestions?: string[];
  placeholder?: string;
  className?: string;
  maxTags?: number;
  disabled?: boolean;
}

const TagsInput = forwardRef<HTMLDivElement, TagsInputProps>(
  (
    {
      value = [],
      onChange,
      suggestions = [],
      popularSuggestions = [],
      placeholder = "Add tags...",
      className,
      maxTags,
      disabled = false,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on input and exclude already selected
    const filteredSuggestions = suggestions
      .filter(
        (suggestion) =>
          suggestion.label.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(suggestion.value)
      )
      .slice(0, 8); // Limit to 8 suggestions

    // Available popular suggestions (not already selected)
    const availablePopular = popularSuggestions.filter(
      (tag) => !value.includes(tag)
    );

    const addTag = (tag: string) => {
      const trimmedTag = tag.trim();
      if (
        trimmedTag &&
        !value.includes(trimmedTag) &&
        (!maxTags || value.length < maxTags)
      ) {
        onChange([...value, trimmedTag]);
        setInputValue("");
        setShowSuggestions(false);
      }
    };

    const removeTag = (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        if (inputValue.trim()) {
          addTag(inputValue);
        }
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        removeTag(value[value.length - 1]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setShowSuggestions(newValue.length > 0 && filteredSuggestions.length > 0);
    };

    const handleSuggestionClick = (suggestion: LookupOption) => {
      addTag(suggestion.value);
      inputRef.current?.focus();
    };

    const handlePopularClick = (tag: string) => {
      addTag(tag);
      inputRef.current?.focus();
    };

    // Close suggestions when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div ref={containerRef} className="relative w-full">
        {/* Tags Input Container */}
        <div
          ref={ref}
          className={cn(
            "flex min-h-10 w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          onClick={() => !disabled && inputRef.current?.focus()}
        >
          {/* Selected Tags */}
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                >
                  <Icon name="X" className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue && filteredSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={
              disabled || (maxTags !== undefined && value.length >= maxTags)
            }
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.value}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.label}
              </div>
            ))}
          </div>
        )}

        {/* Popular Suggestions */}
        {!showSuggestions && availablePopular.length > 0 && !inputValue && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-2">
              Popular choices:
            </p>
            <div className="flex flex-wrap gap-1">
              {availablePopular.slice(0, 6).map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handlePopularClick(tag)}
                  disabled={disabled}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

TagsInput.displayName = "TagsInput";

export { TagsInput };
