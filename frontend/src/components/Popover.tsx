import * as PopoverRadix from '@radix-ui/react-popover';
import { ReactNode } from 'react';

const Popover = PopoverRadix.Root;
const PopoverTrigger = PopoverRadix.Trigger;
const PopoverAnchor = PopoverRadix.Anchor;

const PopoverContent = ({ children }: { children: ReactNode }) => (
  <PopoverRadix.Portal>
    <PopoverRadix.Content className="rounded-md bg-white shadow-sm">
      {children}
    </PopoverRadix.Content>
  </PopoverRadix.Portal>
);

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
