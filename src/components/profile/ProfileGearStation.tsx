"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GearSelector } from "./GearSelector";
import { NewGearForm } from "./NewGearForm";
import { ShareSection } from "./ShareSection";
import {
  addExistingGear,
  createAndAddGear,
  removeGear,
} from "@/app/actions/gear";
import { useStationPhotos } from "@/hooks/use-station-photos";
import type { ProfileGear, StationPhoto } from "@/types/profile-types";
import type { CreateNewGearFormData } from "@/lib/validations/gear";

type ProfileGearStationProps = {
  gear: ProfileGear[];
  photos: StationPhoto[];
  username: string | null;
  isOwner?: boolean;
  isAnonymous?: boolean;
};

export function ProfileGearStation({
  gear,
  photos,
  username,
  isOwner = false,
  isAnonymous = false,
}: ProfileGearStationProps) {
  const hasGear = gear.length > 0;
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [editMode, setEditMode] = useState<"add-existing" | "add-new" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use station photos hook
  const {
    uploadPhoto,
    deletePhoto,
    displayPhotos,
    isUploading,
    canUploadMore,
  } = useStationPhotos(photos);

  const handlePrev = () => {
    setFocusedIndex((prev) => (prev > 0 ? prev - 1 : displayPhotos.length - 1));
  };

  const handleNext = () => {
    setFocusedIndex((prev) => (prev < displayPhotos.length - 1 ? prev + 1 : 0));
  };

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: 2097152, // 2MB
    multiple: true,
    maxFiles: 5 - displayPhotos.length,
    disabled: !isOwner || isAnonymous || !canUploadMore || isUploading,
    onDrop: (acceptedFiles, rejectedFiles) => {
      acceptedFiles.forEach((file) => {
        uploadPhoto(file);
      });

      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            toast.error(`${file.name}: File size must be less than 2MB`);
          } else if (error.code === "file-invalid-type") {
            toast.error(`${file.name}: File must be JPEG, PNG, or WebP`);
          } else {
            toast.error(`${file.name}: ${error.message}`);
          }
        });
      });
    },
  });

  const handleDeleteConfirm = () => {
    if (deletePhotoId) {
      deletePhoto(deletePhotoId);
      setDeletePhotoId(null);
    }
  };

  const handleAddExistingGear = async (gearId: string) => {
    setIsSubmitting(true);
    const result = await addExistingGear({ gearId });
    if (result.success) {
      toast.success("Gear added!");
      setEditMode(null);
    } else {
      toast.error(result.error || "Failed to add gear");
    }
    setIsSubmitting(false);
  };

  const handleCreateAndAddGear = async (data: CreateNewGearFormData) => {
    setIsSubmitting(true);
    const result = await createAndAddGear(data);
    if (result.success) {
      toast.success("New gear created and added!");
      setEditMode(null);
    } else {
      toast.error(result.error || "Failed to create gear");
    }
    setIsSubmitting(false);
  };

  const handleRemoveGear = async (userGearId: string) => {
    if (!confirm("Are you sure you want to remove this gear item?")) {
      return;
    }

    const result = await removeGear({ userGearId });
    if (result.success) {
      toast.success("Gear removed");
    } else {
      toast.error(result.error || "Failed to remove gear");
    }
  };

  return (
    <div id="gear-station">
      <Stack gap="12" className="pt-8">
        <Stack gap="6">
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              SETUP
            </span>
          </div>
          <Cluster align="center" className="justify-between">
            <h2 className="text-title text-balance leading-[1.1] tracking-tight">
              Gear & <span className="text-accent italic">Station.</span>
            </h2>
            {!isAnonymous && (
              <ShareSection section="gear-station" username={username} />
            )}
          </Cluster>
        </Stack>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gear Section */}
          <Stack gap="8">
            <Stack gap="1">
              <h3 className="text-heading font-serif italic">My Tools</h3>
              <p className="text-caption">
                {isAnonymous
                  ? "Items you've used in your journey so far. Sign up to save your full setup."
                  : "A simple list of what I use to brew."}
              </p>
            </Stack>

            {hasGear ? (
              <Accordion
                type="multiple"
                defaultValue={["grinder", "brewer", "accessory"]}
                className="w-full"
              >
                {(["grinder", "brewer", "accessory"] as const).map(
                  (category) => {
                    const items = gear.filter((g) => g.category === category);
                    if (items.length === 0) return null;

                    const categoryLabel =
                      category === "grinder"
                        ? "Grinder"
                        : category === "brewer"
                          ? "Brewer"
                          : "Accessories";

                    return (
                      <AccordionItem
                        key={category}
                        value={category}
                        className="border-border/20"
                      >
                        <AccordionTrigger className="text-label text-muted-foreground uppercase tracking-widest font-medium hover:no-underline py-3">
                          {categoryLabel} ({items.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-3 pt-2">
                            {items.map((item) => {
                              const displayName = item.brand
                                ? `${item.brand} ${item.model || item.name}`
                                : item.name;

                              return (
                                <li
                                  key={item.id}
                                  className="flex items-center justify-between group cursor-pointer py-2 border-b border-border/10"
                                >
                                  <span className="text-body text-muted-foreground group-hover:text-foreground transition-colors">
                                    {displayName}
                                  </span>
                                  {isOwner && (
                                    <button
                                      onClick={() => handleRemoveGear(item.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80 p-1"
                                      aria-label="Remove gear"
                                    >
                                      <Icon name="Trash" size={12} />
                                    </button>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  }
                )}
              </Accordion>
            ) : (
              <p className="text-body text-muted-foreground italic">
                No gear added yet.
              </p>
            )}

            {isOwner && !editMode && !isAnonymous && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-label hover:text-accent transition-colors w-fit"
                onClick={() => setEditMode("add-existing")}
                disabled={isSubmitting}
              >
                <Icon name="Plus" size={12} className="mr-2" />
                Add from catalog
              </Button>
            )}

            {isOwner && editMode && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                {editMode === "add-existing" ? (
                  <Stack gap="4">
                    <GearSelector
                      onSelect={handleAddExistingGear}
                      onCreateNew={() => setEditMode("add-new")}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditMode(null)}
                      className="w-fit"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </Stack>
                ) : (
                  <NewGearForm
                    onSubmit={handleCreateAndAddGear}
                    onCancel={() => setEditMode(null)}
                  />
                )}
              </div>
            )}
          </Stack>

          {/* Coffee Station Section */}
          <Stack gap="8">
            <Cluster align="center">
              <Stack gap="1">
                <h3 className="text-heading font-serif italic text-right md:text-left">
                  The Station
                </h3>
                <p className="text-caption text-right md:text-left">
                  {isAnonymous
                    ? "Sign up to upload your coffee station and share your space."
                    : "A glimpse of where the magic happens."}
                </p>
              </Stack>
              {isOwner && !isAnonymous && (
                <>
                  <input
                    {...getInputProps()}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full ml-auto"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!canUploadMore || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Icon
                          name="CircleNotch"
                          size={14}
                          className="mr-2 animate-spin"
                        />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Icon name="Camera" size={14} className="mr-2" />
                        Update
                      </>
                    )}
                  </Button>
                </>
              )}
            </Cluster>

            {displayPhotos.length > 0 ? (
              <Stack gap="6">
                <div className="relative h-[280px] w-full flex items-center justify-center perspective-[1000px]">
                  {/* Visual Stack */}
                  {displayPhotos.map((photo, i) => {
                    let position = "hidden";
                    if (i === focusedIndex) position = "focused";
                    else if (
                      i ===
                      (focusedIndex - 1 + displayPhotos.length) %
                        displayPhotos.length
                    )
                      position = "left";
                    else if (i === (focusedIndex + 1) % displayPhotos.length)
                      position = "right";

                    if (position === "hidden" && displayPhotos.length > 3)
                      return null;

                    const isUploadingPhoto = photo.id.startsWith("temp-");

                    return (
                      <div
                        key={photo.id}
                        className={cn(
                          "absolute transition-all duration-700 ease-out rounded-2xl overflow-hidden shadow-2xl",
                          position === "focused" &&
                            "z-30 w-3/4 h-full surface-1 scale-100 opacity-100 translate-x-0 grayscale-0",
                          position === "left" &&
                            "z-10 w-1/2 h-5/6 surface-0 scale-90 opacity-40 -translate-x-1/2 grayscale blur-[1px]",
                          position === "right" &&
                            "z-10 w-1/2 h-5/6 surface-0 scale-90 opacity-40 translate-x-1/2 grayscale blur-[1px]",
                          position === "hidden" &&
                            "z-0 w-1/2 h-5/6 opacity-0 scale-75"
                        )}
                      >
                        <Image
                          src={photo.image_url}
                          alt={`Station ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                        {isUploadingPhoto && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
                            <div className="flex flex-col items-center gap-2">
                              <Icon
                                name="CircleNotch"
                                size={24}
                                className="animate-spin text-white"
                              />
                              <span className="text-white text-caption">
                                Uploading...
                              </span>
                            </div>
                          </div>
                        )}
                        {isOwner && !isUploadingPhoto && (
                          <button
                            onClick={() => setDeletePhotoId(photo.id)}
                            className="absolute top-2 right-2 z-40 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors text-white"
                            aria-label="Delete photo"
                          >
                            <Icon name="X" size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Bar */}
                <Cluster gap="2" align="center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrev}
                    className="text-muted-foreground hover:text-foreground h-8 w-8"
                    disabled={displayPhotos.length <= 1}
                  >
                    <Icon name="CaretLeft" size={16} />
                  </Button>

                  {isOwner && canUploadMore && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 w-8 rounded-full border border-dashed border-border/60 flex items-center justify-center hover:bg-muted/20 transition-colors text-muted-foreground/60 hover:text-accent"
                      disabled={isUploading}
                      aria-label="Add photo"
                    >
                      <Icon name="Plus" size={16} />
                    </button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    className="text-muted-foreground hover:text-foreground h-8 w-8"
                    disabled={displayPhotos.length <= 1}
                  >
                    <Icon name="CaretRight" size={16} />
                  </Button>
                </Cluster>
              </Stack>
            ) : isAnonymous ? (
              <div className="relative h-[280px] w-full flex items-center justify-center">
                <div className="absolute inset-0 grayscale opacity-40 blur-[2px] transition-all hover:blur-0 hover:opacity-60 duration-700">
                  <Image
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop"
                    alt="Mock Station"
                    fill
                    className="object-cover rounded-[2rem]"
                  />
                </div>
                <Stack
                  gap="2"
                  className="z-10 bg-background/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl max-w-xs text-center"
                >
                  <Icon name="Camera" size={24} className="text-accent" />
                  <h3 className="text-body font-serif italic">
                    This could be your station
                  </h3>
                  <p className="text-micro text-muted-foreground">
                    Upload photos of your brewing setup once you create your
                    profile.
                  </p>
                </Stack>
              </div>
            ) : isOwner ? (
              <Card
                {...getRootProps()}
                className={cn(
                  "h-[280px] border border-dashed rounded-3xl flex flex-col items-center justify-center bg-muted/5 group py-0 gap-0 cursor-pointer transition-colors",
                  isDragActive
                    ? "border-accent bg-accent/10"
                    : "border-border/60 hover:border-border hover:bg-muted/10"
                )}
              >
                <input {...getInputProps()} className="hidden" />
                <Icon
                  name={isDragActive ? "Upload" : "Plus"}
                  size={32}
                  className={cn(
                    "transition-colors mb-4",
                    isDragActive
                      ? "text-accent"
                      : "text-muted-foreground/20 group-hover:text-accent/40"
                  )}
                />
                <p className="text-caption italic text-muted-foreground text-center px-4">
                  {isDragActive
                    ? "Drop photos here"
                    : "Drop photos here or click to upload"}
                </p>
                <p className="text-micro text-muted-foreground/60 mt-2 text-center px-4">
                  Up to 5 photos, 2MB each
                </p>
              </Card>
            ) : (
              <Card className="h-[280px] border border-dashed border-border/60 rounded-3xl flex flex-col items-center justify-center bg-muted/5 group py-0 gap-0">
                <Icon
                  name="Plus"
                  size={32}
                  className="text-muted-foreground/20 group-hover:text-accent/40 transition-colors mb-4"
                />
                <p className="text-caption italic text-muted-foreground">
                  Add photos of your brewing station
                </p>
              </Card>
            )}
          </Stack>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deletePhotoId}
          onOpenChange={(open: boolean) => !open && setDeletePhotoId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this photo from your station.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletePhotoId(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Stack>
    </div>
  );
}
