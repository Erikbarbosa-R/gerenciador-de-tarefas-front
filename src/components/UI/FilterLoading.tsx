import React from 'react';
import styled, { keyframes } from 'styled-components';
import { MdRefresh } from 'react-icons/md';
import Icon from './Icon';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const progress = keyframes`
  0% { 
    width: 0%;
    transform: translateX(0);
  }
  50% { 
    width: 70%;
    transform: translateX(0);
  }
  100% { 
    width: 100%;
    transform: translateX(0);
  }
`;

const LoadingContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  border: 1px solid #e9ecef;
`;

const SpinningIcon = styled.div`
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const LoadingTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const LoadingProgress = styled.div`
  width: 100%;
  height: 3px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  border-radius: 2px;
  animation: ${progress} 2s ease-in-out infinite;
  width: 0%;
`;

const LoadingDetails = styled.div`
  font-size: 12px;
  color: #999;
  font-style: italic;
`;

interface FilterLoadingProps {
  filterName: string;
  isVisible: boolean;
}

const FilterLoading: React.FC<FilterLoadingProps> = ({ filterName, isVisible }) => {
  if (!isVisible) return null;

  const getFilterDescription = (filter: string) => {
    switch (filter) {
      case 'all':
        return 'Carregando todas as tarefas...';
      case 'my-tasks':
        return 'Buscando tarefas delegadas para você...';
      case 'my-pending':
        return 'Carregando suas tarefas pendentes...';
      case 'my-completed':
        return 'Carregando suas tarefas concluídas...';
      case 'my-high-priority':
        return 'Buscando suas tarefas urgentes...';
      case 'status-0':
        return 'Carregando tarefas pendentes...';
      case 'status-1':
        return 'Carregando tarefas em progresso...';
      case 'status-2':
        return 'Carregando tarefas concluídas...';
      case 'priority-0':
        return 'Carregando tarefas de baixa prioridade...';
      case 'priority-1':
        return 'Carregando tarefas de média prioridade...';
      case 'priority-2':
        return 'Carregando tarefas de alta prioridade...';
      case 'priority-3':
        return 'Carregando tarefas críticas...';
      default:
        return 'Carregando tarefas...';
    }
  };

  return (
    <LoadingContainer>
      <SpinningIcon>
        <Icon icon={MdRefresh} size={40} color="#007bff" />
      </SpinningIcon>
      
      <LoadingTitle>Aplicando Filtro</LoadingTitle>
      
      <LoadingText>
        {getFilterDescription(filterName)}
      </LoadingText>
      
      <LoadingProgress>
        <ProgressBar />
      </LoadingProgress>
      
      <LoadingDetails>
        Buscando dados do servidor...
      </LoadingDetails>
    </LoadingContainer>
  );
};

export default FilterLoading;
