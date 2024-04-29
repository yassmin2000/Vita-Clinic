import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, RotateCw, Search } from 'lucide-react';

import PDFFullScreen from './PDFFullScreen';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';

interface PDFRendererControlrsProps {
  currentPage: number;
  scale: number;
  pagesNumber: number;
  url: string;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setScale: Dispatch<SetStateAction<number>>;
  setRotation: Dispatch<SetStateAction<number>>;
}

export default function PDFRendererControlrs({
  scale,
  currentPage,
  pagesNumber,
  url,
  setCurrentPage,
  setScale,
  setRotation,
}: PDFRendererControlrsProps) {
  const { toast } = useToast();

  const PageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= pagesNumber!),
  });
  type PageValidatorType = z.infer<typeof PageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PageValidatorType>({
    resolver: zodResolver(PageValidator),
    defaultValues: {
      page: '1',
    },
  });

  const handlePageSubmit = ({ page }: PageValidatorType) => {
    setCurrentPage(Number(page));
    setValue('page', String(page));
  };

  return (
    <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
      <div className="5 flex items-center gap-1">
        <Button
          onClick={() => {
            setCurrentPage(currentPage - 1 > 1 ? currentPage - 1 : 1);
            setValue('page', String(currentPage - 1));
          }}
          disabled={currentPage <= 1}
          variant="ghost"
          aria-label="previous page"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1.5">
          <Input
            {...register('page')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(handlePageSubmit)();
              }
            }}
            className={cn(
              'h-8 w-12',
              errors.page && 'focus-visible:ring-red-500'
            )}
          />
          <p className="space-x-1 text-sm text-zinc-700">
            <span>/</span>
            <span>{pagesNumber ?? 'x'}</span>
          </p>
        </div>

        <Button
          onClick={() => {
            setCurrentPage(
              currentPage + 1 > pagesNumber! ? pagesNumber! : currentPage + 1
            );
            setValue('page', String(currentPage + 1));
          }}
          disabled={currentPage >= pagesNumber! || pagesNumber === undefined}
          variant="ghost"
          aria-label="next page"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center gap-1.5"
              aria-label="zoom"
              variant="ghost"
            >
              <Search className="h-4 w-4" />
              {scale * 100}%
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setScale(0.5)}>
              50%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setScale(0.75)}>
              75%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setScale(1)}>
              100%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setScale(1.5)}>
              150%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setScale(2)}>
              200%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setScale(2.5)}>
              250%
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-0.5">
          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            variant="ghost"
            aria-label="rotate 90 degress"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <PDFFullScreen url={url} />
        </div>
      </div>
    </div>
  );
}
