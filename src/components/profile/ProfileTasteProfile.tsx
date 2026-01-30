"use client";

import { Card } from "@/components/ui/card";
import { Stack } from "@/components/primitives/stack";
import { TagList } from "@/components/common/Tag";
import Tag from "@/components/common/Tag";
import { Icon } from "@/components/common/Icon";

type TasteProfileData = {
  roasts: string[];
  methods: string[];
  tendencies: string[];
};

type ProfileTasteProfileProps = {
  profile: TasteProfileData;
  totalReviews: number;
  isAnonymous?: boolean;
};

export function ProfileTasteProfile({
  profile,
  totalReviews,
  isAnonymous = false,
}: ProfileTasteProfileProps) {
  const hasEnoughRatings = totalReviews >= 3;
  const hasData =
    profile.roasts.length > 0 ||
    profile.methods.length > 0 ||
    profile.tendencies.length > 0;

  return (
    <Card className="bg-muted/30 rounded-3xl p-10 border border-border/20 py-10 gap-0">
      <Stack gap="8">
        <Stack gap="6">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-4">
              <span className="h-px w-8 md:w-12 bg-accent/60" />
              <span className="text-overline text-muted-foreground tracking-[0.15em]">
                INSIGHTS
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-micro text-muted-foreground/60 bg-muted/50 px-2 py-1 rounded-full border border-border/10">
              <Icon name="LockKey" size={12} color="muted" />
              <span>Visible only to you</span>
            </div>
          </div>
          <Stack gap="1">
            <h2 className="text-title text-balance leading-[1.1] tracking-tight">
              Taste <span className="text-accent italic">Observations.</span>
            </h2>
            <p className="text-caption max-w-xl">
              {isAnonymous
                ? "A glimpse of your local preferences. Sign up to track your evolution over time."
                : "Derived from your rating record. Not an identity, just a glimpse of your current preferences."}
            </p>
          </Stack>
        </Stack>

        {!hasEnoughRatings ? (
          <Card className="py-20 border border-dashed border-border/60 rounded-3xl flex flex-col items-center justify-center text-center py-20 gap-0">
            <Icon
              name="Coffee"
              size={32}
              className="text-muted-foreground/30 mb-4"
            />
            <p className="text-body-muted italic">
              Not enough ratings yet. Rate 3 or more coffees to see your taste
              profile observations.
            </p>
          </Card>
        ) : !hasData ? (
          <Card className="py-20 border border-dashed border-border/60 rounded-3xl flex flex-col items-center justify-center text-center py-20 gap-0">
            <Icon
              name="Coffee"
              size={32}
              className="text-muted-foreground/30 mb-4"
            />
            <p className="text-body-muted italic">
              Your taste profile is forming. Keep rating coffees to see patterns
              emerge.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Stack gap="3">
              <span className="text-overline text-muted-foreground tracking-widest">
                Often brewed as
              </span>
              <TagList>
                {profile.methods.length > 0 ? (
                  profile.methods.map((method) => (
                    <Tag
                      key={method}
                      variant="outline"
                      className="border-border/40 bg-transparent"
                    >
                      {method}
                    </Tag>
                  ))
                ) : (
                  <span className="text-caption text-muted-foreground/60 italic">
                    No data yet
                  </span>
                )}
              </TagList>
            </Stack>

            <Stack gap="3">
              <span className="text-overline text-muted-foreground tracking-widest">
                Roast levels
              </span>
              <TagList>
                {profile.roasts.length > 0 ? (
                  profile.roasts.map((roast) => (
                    <Tag
                      key={roast}
                      variant="outline"
                      className="border-border/40 bg-transparent"
                    >
                      {roast}
                    </Tag>
                  ))
                ) : (
                  <span className="text-caption text-muted-foreground/60 italic">
                    No data yet
                  </span>
                )}
              </TagList>
            </Stack>

            <Stack gap="3">
              <span className="text-overline text-muted-foreground tracking-widest">
                Character tends toward
              </span>
              <TagList>
                {profile.tendencies.length > 0 ? (
                  profile.tendencies.map((tendency) => (
                    <Tag
                      key={tendency}
                      variant="outline"
                      className="border-border/40 bg-transparent"
                    >
                      {tendency}
                    </Tag>
                  ))
                ) : (
                  <span className="text-caption text-muted-foreground/60 italic">
                    No data yet
                  </span>
                )}
              </TagList>
            </Stack>
          </div>
        )}
      </Stack>
    </Card>
  );
}
