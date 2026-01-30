"use client";

import { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalType = "confirmation" | "alert" | "custom";

type ModalData = {
  id: string;
  type: ModalType;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  component?: React.ComponentType<any>;
  props?: Record<string, any>;
};

type ModalContextType = {
  modals: ModalData[];
  openModal: (modal: Omit<ModalData, "id">) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalData[]>([]);

  const openModal = (modal: Omit<ModalData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newModal = { ...modal, id };
    setModals((prev) => [...prev, newModal]);
    return id;
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  const value = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRenderer />
    </ModalContext.Provider>
  );
}

function ModalRenderer() {
  const { modals, closeModal } = useModal();

  return (
    <>
      {modals.map((modal) => (
        <Dialog key={modal.id} onOpenChange={() => closeModal(modal.id)} open>
          <DialogContent>
            {modal.component ? (
              <modal.component
                {...modal.props}
                onClose={() => closeModal(modal.id)}
              />
            ) : (
              <>
                <DialogHeader>
                  {modal.title && <DialogTitle>{modal.title}</DialogTitle>}
                  {modal.description && (
                    <DialogDescription>{modal.description}</DialogDescription>
                  )}
                </DialogHeader>
                <DialogFooter>
                  {modal.cancelText && (
                    <Button
                      onClick={() => {
                        modal.onCancel?.();
                        closeModal(modal.id);
                      }}
                      type="button"
                      variant="outline"
                    >
                      {modal.cancelText}
                    </Button>
                  )}
                  {modal.confirmText && (
                    <Button
                      onClick={() => {
                        modal.onConfirm?.();
                        closeModal(modal.id);
                      }}
                      type="button"
                    >
                      {modal.confirmText}
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
