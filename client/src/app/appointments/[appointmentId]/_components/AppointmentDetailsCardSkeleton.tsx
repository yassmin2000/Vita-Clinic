import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppointmentDetailsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="mb-2 flex items-center gap-4">
            <Skeleton className="h-4 w-[30%]" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-[60%]" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  );
}
