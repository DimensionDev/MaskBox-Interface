import { useCallback, useState } from 'react';

export function useDialog(): [open: boolean, openDialog: () => void, closeDialog: () => void] {
  const [open, setOpen] = useState(false);
  const openDialog = useCallback(() => {
    setOpen(true);
  }, []);
  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  return [open, openDialog, closeDialog];
}
