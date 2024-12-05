import { createContext, useContext, ReactNode } from 'react';
import { useContainerStats } from '../hooks/useContainerStats';
import { Container, ContainerStats } from '../types';

interface ContainerStatsContextType {
  stats: Record<string, ContainerStats>;
}

const ContainerStatsContext = createContext<ContainerStatsContextType | null>(null);

export function ContainerStatsProvider({ 
  containers, 
  children 
}: { 
  containers: Container[];
  children: ReactNode;
}) {
  const { stats } = useContainerStats(containers.map(c => c.id));

  return (
    <ContainerStatsContext.Provider value={{ stats }}>
      {children}
    </ContainerStatsContext.Provider>
  );
}

export function useContainerStatsContext() {
  const context = useContext(ContainerStatsContext);
  if (!context) {
    throw new Error('useContainerStatsContext must be used within a ContainerStatsProvider');
  }
  return context;
}