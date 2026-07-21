import {
  CoffeeIcon,
  StarIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SearchableItem } from "@/types/search";

type SearchResultRowProps = {
  item: SearchableItem;
  /** Hero dropdown uses the compact density; the command palette uses the default. */
  compact?: boolean;
};

/**
 * Content for a single search result, shared by the command palette
 * (SearchCommand) and the hero dropdown (HeroSearch). Renders a fragment so each
 * surface keeps its own interactive wrapper (CommandItem vs <button>) and its own
 * padding/hover, while the result content stays identical between them.
 */
export function SearchResultRow({
  item,
  compact = false,
}: SearchResultRowProps) {
  const displayTags = item.tags.slice(0, compact ? 2 : 3);
  const hasMoreTags = !compact && item.tags.length > 3;
  const rating = item.metadata.coffee?.rating;
  const coffeeCount = item.metadata.roaster?.coffeeCount;

  return (
    <>
      <Avatar
        className={cn(
          "shrink-0 border border-border/50",
          compact ? "size-10" : "size-12"
        )}
      >
        {item.imageUrl ? (
          <AvatarImage alt={item.title} src={item.imageUrl} />
        ) : null}
        <AvatarFallback className="bg-muted/80 text-popover-foreground">
          <Icon
            icon={item.type === "coffee" ? CoffeeIcon : StorefrontIcon}
            size={compact ? 20 : 24}
          />
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div
          className={cn(
            "font-medium text-popover-foreground leading-snug",
            compact ? "text-caption" : "text-body"
          )}
        >
          {item.title}
        </div>
        {item.description && (
          <div className="line-clamp-1 text-caption text-muted-foreground">
            {item.description}
          </div>
        )}
        {(displayTags.length > 0 || item.flavorNotes?.length) && (
          <div className="flex flex-wrap gap-1.5">
            {item.flavorNotes?.slice(0, 2).map((note) => (
              <Badge
                className="font-medium text-overline"
                key={note}
                variant="secondary"
              >
                {note}
              </Badge>
            ))}
            {displayTags.map((tag) => (
              <Badge
                className="font-medium text-overline"
                key={tag}
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
            {hasMoreTags && (
              <Badge className="font-medium text-overline" variant="outline">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      {rating != null && (
        <div className="flex shrink-0 items-center gap-1 font-medium text-caption text-muted-foreground">
          <Icon color="accent" icon={StarIcon} size={14} />
          {rating.toFixed(1)}
        </div>
      )}

      {coffeeCount != null && (
        <div className="shrink-0 font-medium text-caption text-muted-foreground">
          {coffeeCount} coffees
        </div>
      )}
    </>
  );
}
