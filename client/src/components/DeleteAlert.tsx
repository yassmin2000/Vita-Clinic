import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DeleteAlertProps {
  title: string;
  description?: string;
  deleteText?: string;
  disabled?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteAlert({
  title,
  description,
  deleteText = 'Delete',
  disabled = true,
  isOpen,
  onClose,
  onDelete,
}: DeleteAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={disabled ? undefined : onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            disabled={disabled}
          >
            {deleteText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
