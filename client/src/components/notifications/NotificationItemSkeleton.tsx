import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface NotificationItemSkeletonProps {
  isPopover?: boolean;
}

export default function NotificationItemSkeleton({
  isPopover = false,
}: NotificationItemSkeletonProps) {
  return (
    <Card
      className={cn(
        'flex items-center justify-between border-black/5 p-4 transition-all dark:border-gray-800',
        isPopover &&
          'w-full rounded-none border-b-2 border-l-0 border-r-0 border-t-0 px-1.5 pb-2 pt-0 shadow-none last:border-b-0'
      )}
    >
      <div className="flex items-center gap-x-4">
        <div className="p-2">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Skeleton
            className={cn('h-4 w-40 sm:w-96', isPopover && 'sm:w-40')}
          />
          <Skeleton className="h-4 w-[50%]" />
        </div>
      </div>
    </Card>
  );
}
