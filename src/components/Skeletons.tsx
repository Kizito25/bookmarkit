import { cn } from "@/lib/utils";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
};

export function BookmarkCardSkeleton() {
    return (
        <div className="flex flex-col space-y-3 rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded-sm" />
                    <Skeleton className="h-5 w-40" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
            </div>
        </div>
    )
}

export function BookmarkListSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <BookmarkCardSkeleton key={i} />
            ))}
        </div>
    );
}
