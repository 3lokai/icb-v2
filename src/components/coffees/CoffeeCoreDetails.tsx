import Link from "next/link";
import type { CoffeeDetail } from "@/types/coffee-types";
import Tag, { TagList } from "@/components/common/Tag";
import { cn } from "@/lib/utils";

type CoffeeCoreDetailsProps = {
  coffee: CoffeeDetail;
  className?: string;
};

export function CoffeeCoreDetails({
  coffee,
  className,
}: CoffeeCoreDetailsProps) {
  return (
    <div className={cn("stack-md", className)}>
      {/* Title */}
      <div>
        <h1 className="text-display font-serif">{coffee.name}</h1>
        {coffee.roaster && (
          <div className="mt-2">
            <span className="text-body-muted">by </span>
            <Link
              href={`/roasters/${coffee.roaster.slug}`}
              className="text-body text-primary hover:text-primary/80 transition-colors font-medium"
            >
              {coffee.roaster.name}
            </Link>
          </div>
        )}
      </div>

      {/* Core Attributes */}
      <div className="stack-sm">
        <h2 className="text-subheading">Details</h2>
        <div className="flex flex-wrap gap-3">
          {coffee.roast_level && (
            <div>
              <span className="text-caption text-muted-foreground">
                Roast:{" "}
              </span>
              <span className="text-body">
                {coffee.roast_level_raw || coffee.roast_level}
              </span>
            </div>
          )}
          {coffee.process && (
            <div>
              <span className="text-caption text-muted-foreground">
                Process:{" "}
              </span>
              <span className="text-body">
                {coffee.process_raw || coffee.process}
              </span>
            </div>
          )}
          {coffee.bean_species && (
            <div>
              <span className="text-caption text-muted-foreground">
                Species:{" "}
              </span>
              <span className="text-body">{coffee.bean_species}</span>
            </div>
          )}
          {coffee.crop_year && (
            <div>
              <span className="text-caption text-muted-foreground">
                Crop Year:{" "}
              </span>
              <span className="text-body">{coffee.crop_year}</span>
            </div>
          )}
          {coffee.harvest_window && (
            <div>
              <span className="text-caption text-muted-foreground">
                Harvest:{" "}
              </span>
              <span className="text-body">{coffee.harvest_window}</span>
            </div>
          )}
        </div>
      </div>

      {/* Flavor Notes */}
      {coffee.flavor_notes.length > 0 && (
        <div className="stack-sm">
          <h2 className="text-subheading">Flavor Notes</h2>
          <TagList>
            {coffee.flavor_notes.map((note) => (
              <Tag key={note.id} variant="outline">
                {note.label}
              </Tag>
            ))}
          </TagList>
        </div>
      )}

      {/* Tags and Badges */}
      <div className="stack-sm">
        <TagList>
          {coffee.decaf && <Tag variant="filled">Decaf</Tag>}
          {coffee.is_limited && <Tag variant="filled">Limited</Tag>}
          {coffee.tags &&
            coffee.tags.map((tag, index) => (
              <Tag key={index} variant="outline">
                {tag}
              </Tag>
            ))}
        </TagList>
      </div>
    </div>
  );
}
