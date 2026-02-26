"use client";

import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  createApiKey,
  revokeApiKey,
  type ApiKeyListItem,
  type KeyUsage,
} from "@/app/actions/api-keys";
import { UsageCharts } from "./UsageCharts";
import { formatDistanceToNow } from "date-fns";

type DeveloperPortalProps = {
  initialKeys: ApiKeyListItem[];
  initialUsage: Record<string, KeyUsage>;
};

export function DeveloperPortal({
  initialKeys,
  initialUsage,
}: DeveloperPortalProps) {
  const [keys, setKeys] = useState<ApiKeyListItem[]>(initialKeys);
  const [usage, setUsage] = useState<Record<string, KeyUsage>>(initialUsage);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createPending, setCreatePending] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showRawKey, setShowRawKey] = useState(false);
  const [rawKeyValue, setRawKeyValue] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function handleCreateKey() {
    setCreateError(null);
    setCreatePending(true);
    const result = await createApiKey(createName);
    setCreatePending(false);
    if (result.success && result.data) {
      setKeys((prev) => [
        {
          id: result.data!.keyId,
          name: createName.trim(),
          key_prefix: result.data!.rawKey.slice(0, 16),
          is_active: true,
          rate_limit_rpm: 60,
          created_at: new Date().toISOString(),
          last_used_at: null,
        },
        ...prev,
      ]);
      setUsage((prev) => ({
        ...prev,
        [result.data!.keyId]: {
          todayTotal: 0,
          hourlyToday: Array.from({ length: 24 }, (_, i) => ({
            hour: String(i).padStart(2, "0"),
            count: 0,
          })),
          dailyTotals: [],
        },
      }));
      setCreateName("");
      setCreateOpen(false);
      setRawKeyValue(result.data.rawKey);
      setShowRawKey(true);
    } else {
      setCreateError(result.error ?? "Failed to create key");
    }
  }

  async function handleRevoke(keyId: string) {
    setRevokingId(keyId);
    const result = await revokeApiKey(keyId);
    setRevokingId(null);
    if (result.success) {
      setKeys((prev) =>
        prev.map((k) => (k.id === keyId ? { ...k, is_active: false } : k))
      );
    }
  }

  async function copyRawKey() {
    if (rawKeyValue) {
      await navigator.clipboard.writeText(rawKeyValue);
    }
  }

  const selectedKeyId = keys[0]?.id;
  const selectedUsage = selectedKeyId ? usage[selectedKeyId] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Create and manage keys for the external API. Base URL:{" "}
              <code className="rounded bg-muted px-1 text-caption">
                /api/v1
              </code>
            </CardDescription>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Icon name="Plus" size={16} className="mr-2" />
            Create key
          </Button>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <p className="text-muted-foreground text-caption">
              No API keys yet. Create one to access the API from external
              services.
            </p>
          ) : (
            <ul className="space-y-3">
              {keys.map((key) => (
                <li
                  key={key.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{key.name}</span>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-caption">
                      {key.key_prefix}…
                    </code>
                    <Badge variant={key.is_active ? "default" : "secondary"}>
                      {key.is_active ? "Active" : "Revoked"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-caption text-muted-foreground">
                    <span>
                      Created{" "}
                      {formatDistanceToNow(new Date(key.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {key.last_used_at && (
                      <span>
                        Last used{" "}
                        {formatDistanceToNow(new Date(key.last_used_at), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                    {key.is_active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevoke(key.id)}
                        disabled={revokingId === key.id}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {keys.length > 0 && selectedUsage && (
        <UsageCharts
          keyId={selectedKeyId!}
          keyName={keys.find((k) => k.id === selectedKeyId)?.name ?? "Key"}
          usage={selectedUsage}
        />
      )}

      {/* Create key: name step */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary/60 opacity-60" />
          <DialogHeader className="px-8 pt-8 pb-4 text-left border-b border-border/10">
            <DialogTitle className="font-serif italic text-title text-primary leading-none">
              Create API key
            </DialogTitle>
            <DialogDescription className="text-micro font-bold uppercase tracking-widest text-muted-foreground/40 mt-2">
              Give this key a name so you can identify it later
            </DialogDescription>
          </DialogHeader>
          <div className="px-8 py-6 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="key-name"
                className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60"
              >
                Name
              </Label>
              <Input
                id="key-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g. My AI Chat App"
                className="w-full px-5 py-3.5 rounded-xl border border-border bg-muted/5 text-body focus:bg-background focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all outline-none"
              />
            </div>
            {createError && (
              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-caption">
                {createError}
              </div>
            )}
          </div>
          <DialogFooter className="px-8 pb-8 pt-4 flex-row gap-2 sm:justify-end border-t border-border/10">
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false);
                setCreateError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateKey}
              disabled={!createName.trim() || createPending}
              className="uppercase tracking-widest font-bold"
            >
              {createPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show raw key once */}
      <Dialog open={showRawKey} onOpenChange={setShowRawKey}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary/60 opacity-60" />
          <DialogHeader className="px-8 pt-8 pb-4 text-left border-b border-border/10">
            <DialogTitle className="font-serif italic text-title text-primary leading-none">
              Copy your API key
            </DialogTitle>
            <DialogDescription className="text-micro font-bold uppercase tracking-widest text-muted-foreground/40 mt-2">
              Store it securely — you won&apos;t see it again
            </DialogDescription>
          </DialogHeader>
          <div className="px-8 py-6 space-y-6">
            <div className="flex gap-2">
              <Input
                readOnly
                value={rawKeyValue ?? ""}
                className="flex-1 font-mono text-caption px-5 py-3.5 rounded-xl border border-border bg-muted/5"
              />
              <Button
                variant="outline"
                onClick={copyRawKey}
                className="shrink-0 uppercase tracking-widest font-bold"
              >
                Copy
              </Button>
            </div>
          </div>
          <DialogFooter className="px-8 pb-8 pt-4 border-t border-border/10">
            <Button
              onClick={() => setShowRawKey(false)}
              className="w-full sm:w-auto uppercase tracking-widest font-bold"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
