import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import useSettingsStore from '@/hooks/useSettingsStore';

interface NewEntityButtonProps {
  title: string;
}

export default function NewEntityButton({ title }: NewEntityButtonProps) {
  const { openForm, resetEntity } = useSettingsStore();

  return (
    <Button
      onClick={() => {
        resetEntity();
        openForm();
      }}
    >
      <Plus className="mr-1 h-4 w-4" /> New {title}
    </Button>
  );
}
