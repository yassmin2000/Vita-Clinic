import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DeviceCardSkeleton() {
  return (
    <Card>
      <CardHeader className="p-0">
        <Skeleton className="h-40 w-full rounded-t-lg" />
        <div className="flex flex-col gap-4 px-4 pb-4 pt-4">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[70%]" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[75%]" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
