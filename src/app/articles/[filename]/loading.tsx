import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="flex-1 flex flex-col py-8 w-full">
            <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4">
                <div className="space-y-4">
                    {/* Title Skeleton */}
                    <Skeleton className="h-9 w-3/4 rounded-lg" />

                    {/* Date Skeleton */}
                    <Skeleton className="h-5 w-40 rounded-lg" />

                    {/* Content Paragraphs */}
                    <div className="space-y-4">
                        <Skeleton className="h-5 w-full rounded-lg" />
                        <Skeleton className="h-5 w-5/6 rounded-lg" />
                        <Skeleton className="h-5 w-4/5 rounded-lg" />
                        <Skeleton className="h-5 w-3/4 rounded-lg" />
                        <Skeleton className="h-5 w-2/3 rounded-lg" />
                    </div>

                    {/* Optional: Add more skeleton elements for other content */}
                    <div className="space-y-4 pt-4">
                        <Skeleton className="h-7 w-1/2 rounded-lg" />
                        <Skeleton className="h-5 w-full rounded-lg" />
                        <Skeleton className="h-5 w-5/6 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
