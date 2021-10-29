import { useCallback, useState } from 'react';

export function useDialog() {
  const [open, setOpen] = useState(false);
  const openDialog = useCallback(() => {
    setOpen(true);
  }, []);
  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  return [open, openDialog, closeDialog] as const;
}
