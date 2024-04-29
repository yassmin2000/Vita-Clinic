import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppointmentItemSkeleton() {
  return (
    <Card className="flex items-center justify-between border-black/5 p-4 transition-all dark:border-gray-800">
      <div className="flex items-center gap-x-4">
        <div className="rounded-md p-2">
          <Skeleton className="h-12 w-12" />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-4 w-40 sm:w-96" />
          <Skeleton className="h-4 w-[50%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    </Card>
  );
}
