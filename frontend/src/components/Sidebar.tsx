import * as Collapsible from '@radix-ui/react-collapsible';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ReactNode, createContext, useContext, useState } from 'react';

type SidebarContext = {
  open: boolean;
};

const SidebarContext = createContext<SidebarContext | null>(null);

const useSidebar = () => {
  const sidebarContext = useContext(SidebarContext);

  if (!sidebarContext) {
    throw new Error("useSidebar can't be used outside of SidebarContext");
  }

  return sidebarContext;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="grid min-h-screen grid-cols-[auto_1fr]"
    >
      <SidebarContext.Provider value={{ open }}>
        {children}
      </SidebarContext.Provider>
    </Collapsible.Root>
  );
};

export const SidebarContent = ({ children }: { children: ReactNode }) => (
  <Collapsible.Content
    className="data-[state=open]:animate-side-bar-slide-in
      data-[state=closed]:animate-side-bar-slide-out overflow-hidden bg-white"
  >
    <div className="grid w-xs gap-4 p-8">{children}</div>
  </Collapsible.Content>
);

export const SidebarTrigger = () => {
  const { open } = useSidebar();
  return (
    <Collapsible.Trigger asChild>
      <button>{open ? <PanelLeftClose /> : <PanelLeftOpen />}</button>
    </Collapsible.Trigger>
  );
};
