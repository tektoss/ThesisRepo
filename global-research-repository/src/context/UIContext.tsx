'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type UIContextType = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  refreshKey: number;
  triggerRefresh: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const triggerRefresh = () => setRefreshKey(prevKey => prevKey + 1);

  return (
    <UIContext.Provider value={{ isModalOpen, openModal, closeModal, refreshKey, triggerRefresh }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}; 