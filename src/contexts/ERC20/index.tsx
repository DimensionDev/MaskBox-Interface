import { TokenType } from '@/lib';
import { createDefer, DeferTuple } from '@/utils';
import { createContext, FC, useContext, useMemo, useState } from 'react';
import { TokenPickerDialog } from './TokenPickerDialog';

interface ContextOptions {
  pickERC20: () => Promise<TokenType>;
}
const ERC20Context = createContext<ContextOptions>(null!);
export const usePickERC20 = () => {
  return useContext(ERC20Context).pickERC20;
};

type PickingDefer = DeferTuple<TokenType>;
interface PickingTask {
  id: number;
  promise: PickingDefer[0];
  resolve: PickingDefer[1];
  reject: PickingDefer[2];
}

let id = 0;
export const ERC20Provider: FC = ({ children }) => {
  const [tasks, setTasks] = useState<PickingTask[]>([]);

  const removeTask = (task: PickingTask) => {
    setTasks((list) => list.filter((t) => t !== task));
  };

  const contextValue = useMemo(() => {
    return {
      pickERC20: async () => {
        const [promise, resolve, reject] = createDefer<TokenType>();
        id += 1;
        setTasks((list) => [
          ...list,
          {
            id,
            promise,
            resolve,
            reject,
          },
        ]);
        return promise;
      },
    };
  }, []);

  return (
    <ERC20Context.Provider value={contextValue}>
      {children}
      {tasks.map((task) => (
        <TokenPickerDialog
          key={task.id}
          open
          onClose={() => removeTask(task)}
          onPick={(token) => {
            task.resolve(token);
            removeTask(task);
          }}
        />
      ))}
    </ERC20Context.Provider>
  );
};
