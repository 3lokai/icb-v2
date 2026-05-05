"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { submitCommunityAction } from "@/app/actions/communities";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { Stack } from "@/components/primitives/stack";

export function CommunitySubmissionModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitCommunityAction(formData);

    setLoading(false);

    if (result.success) {
      toast.success("Community submitted for review!");
      setOpen(false);
    } else {
      toast.error(result.error || "Failed to submit community.");
    }
  };

  if (!user) {
    return (
      <Button variant="outline" asChild size="lg" className="hover-lift">
        <a href={`/login?next=/communities`}>Login to suggest a community</a>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="hover-lift">
          Suggest a Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Suggest a Coffee Community</DialogTitle>
          <DialogDescription>
            Share a space where coffee lovers gather. We&apos;ll review and add
            it to the directory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <Stack gap="4">
            <div className="space-y-2">
              <Label htmlFor="name">Community Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Brewing Enthusiasts India"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select name="platform" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="discord">Discord</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="facebook_group">Facebook Group</SelectItem>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite_url">Invite URL *</Label>
              <Input
                id="invite_url"
                name="invite_url"
                type="url"
                placeholder="https://..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What makes this community special?"
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Optional)</Label>
                <Input id="tags" name="tags" placeholder="roasting, espresso" />
                <p className="text-micro uppercase tracking-widest">
                  Comma separated
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="moderators">Moderators (Optional)</Label>
                <Input
                  id="moderators"
                  name="moderators"
                  placeholder="Names..."
                />
                <p className="text-micro uppercase tracking-widest">
                  Comma separated
                </p>
              </div>
            </div>
          </Stack>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit for Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
