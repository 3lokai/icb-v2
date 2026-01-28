import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-display">Coffee Not Found</h1>
        <p className="mb-8 text-body text-muted-foreground">
          The coffee you&apos;re looking for doesn&apos;t exist or may have been
          removed.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/coffees">Browse All Coffees</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
