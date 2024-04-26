import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportItemSkeleton() {
  return (
    <Card className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10">
      <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
        <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
        <div className="flex-1 truncate">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-2 text-xs text-muted-foreground">
        <Skeleton className="h-4 w-full" />
        <span />
        <Skeleton className="h-8 w-full" />
      </div>
    </Card>
  );
}
