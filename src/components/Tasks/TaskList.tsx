import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTasks } from '../../contexts/TaskContext';
import Button from '../UI/Button';
import TaskCard from './TaskCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import FilterLoading from '../UI/FilterLoading';
import { MdAdd, MdRefresh, MdFilterList } from 'react-icons/md';
import Icon from '../UI/Icon';

const TaskListContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const FilterSection = styled.div`
  margin-bottom: 30px;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const FilterTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleAdvancedButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
    color: #007bff;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 16px;
`;

const FilterGroupTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin: 0 0 8px 0;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const AdvancedFilters = styled.div<{ show: boolean }>`
  display: ${({ show }) => show ? 'block' : 'none'};
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
`;

const FilterButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: ${({ active }) => (active ? '#007bff' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#333')};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active }) => (active ? '#0056b3' : '#f8f9fa')};
  }
`;

const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  color: #ccc;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const EmptyText = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

type FilterType = 'all' | 'my-tasks' | 'my-pending' | 'my-completed' | 'my-high-priority' | 'status-0' | 'status-1' | 'status-2' | 'priority-0' | 'priority-1' | 'priority-2' | 'priority-3';

const TaskList: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    refreshTasks,
    getMyTasks,
    getMyPendingTasks,
    getMyCompletedTasks,
    getMyHighPriorityTasks,
    getTasksByStatus,
    getTasksByPriority
  } = useTasks();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [currentFilterName, setCurrentFilterName] = useState<FilterType>('all');

  // Carregar filtro salvo do localStorage ao inicializar
  useEffect(() => {
    const savedFilter = localStorage.getItem('taskFilter') as FilterType;
    if (savedFilter && savedFilter !== 'all') {
      setFilter(savedFilter);
      setCurrentFilterName(savedFilter);
      // Aplicar o filtro salvo automaticamente sem usar handleFilterChange
      applyFilter(savedFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salvar filtro no localStorage sempre que mudar
  useEffect(() => {
    if (filter !== 'all') {
      localStorage.setItem('taskFilter', filter);
    } else {
      localStorage.removeItem('taskFilter');
    }
  }, [filter]);


  // Garantir que tasks seja sempre um array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Função para aplicar filtro sem alterar estado (usada na inicialização)
  const applyFilter = async (filterType: FilterType) => {
    setIsFilterLoading(true);
    
    try {
      switch (filterType) {
        case 'all':
          await refreshTasks();
          break;
        case 'my-tasks':
          await getMyTasks();
          break;
        case 'my-pending':
          await getMyPendingTasks();
          break;
        case 'my-completed':
          await getMyCompletedTasks();
          break;
        case 'my-high-priority':
          await getMyHighPriorityTasks();
          break;
        case 'status-0':
          await getTasksByStatus(0);
          break;
        case 'status-1':
          await getTasksByStatus(1);
          break;
        case 'status-2':
          await getTasksByStatus(2);
          break;
        case 'priority-0':
          await getTasksByPriority(0);
          break;
        case 'priority-1':
          await getTasksByPriority(1);
          break;
        case 'priority-2':
          await getTasksByPriority(2);
          break;
        case 'priority-3':
          await getTasksByPriority(3);
          break;
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setIsFilterLoading(false);
      }, 500);
    }
  };

  const handleFilterChange = async (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentFilterName(newFilter);
    await applyFilter(newFilter);
  };


  if (loading && safeTasks.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <TaskListContainer>
      <Header>
        <Title>Minhas Tarefas</Title>
        <Link to="/tasks/new">
          <Button variant="primary" size="large">
            <Icon icon={MdAdd} size={18} style={{ marginRight: '8px' }} />
            Nova Tarefa
          </Button>
        </Link>
      </Header>

      {error && (
        <ErrorMessage>
          {error}
          <Button 
            variant="secondary" 
            size="small" 
            onClick={refreshTasks}
            style={{ marginLeft: '10px' }}
          >
            <Icon icon={MdRefresh} size={14} style={{ marginRight: '4px' }} />
            Tentar novamente
          </Button>
        </ErrorMessage>
      )}

      <FilterSection>
        <FilterHeader>
          <FilterTitle>
            <Icon icon={MdFilterList} size={20} />
            Filtros
          </FilterTitle>
          <ToggleAdvancedButton onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Icon icon={MdFilterList} size={16} />
            {showAdvancedFilters ? 'Ocultar' : 'Avançados'}
          </ToggleAdvancedButton>
        </FilterHeader>

        <FilterGroup>
          <FilterGroupTitle>Filtros Principais</FilterGroupTitle>
          <FilterContainer>
            <FilterButton
              active={filter === 'all'}
              onClick={() => handleFilterChange('all')}
            >
              Todas as Tarefas
            </FilterButton>
            <FilterButton
              active={filter === 'my-tasks'}
              onClick={() => handleFilterChange('my-tasks')}
            >
              Minhas Tarefas
            </FilterButton>
            <FilterButton
              active={filter === 'my-pending'}
              onClick={() => handleFilterChange('my-pending')}
            >
              Minhas Pendentes
            </FilterButton>
            <FilterButton
              active={filter === 'my-completed'}
              onClick={() => handleFilterChange('my-completed')}
            >
              Minhas Concluídas
            </FilterButton>
            <FilterButton
              active={filter === 'my-high-priority'}
              onClick={() => handleFilterChange('my-high-priority')}
            >
              Minhas Urgentes
            </FilterButton>
          </FilterContainer>
        </FilterGroup>

        <AdvancedFilters show={showAdvancedFilters}>
          <FilterGroup>
            <FilterGroupTitle>Por Status</FilterGroupTitle>
            <FilterContainer>
              <FilterButton
                active={filter === 'status-0'}
                onClick={() => handleFilterChange('status-0')}
              >
                Pendentes
              </FilterButton>
              <FilterButton
                active={filter === 'status-1'}
                onClick={() => handleFilterChange('status-1')}
              >
                Em Progresso
              </FilterButton>
              <FilterButton
                active={filter === 'status-2'}
                onClick={() => handleFilterChange('status-2')}
              >
                Concluídas
              </FilterButton>
            </FilterContainer>
          </FilterGroup>

          <FilterGroup>
            <FilterGroupTitle>Por Prioridade</FilterGroupTitle>
            <FilterContainer>
              <FilterButton
                active={filter === 'priority-0'}
                onClick={() => handleFilterChange('priority-0')}
              >
                Baixa
              </FilterButton>
              <FilterButton
                active={filter === 'priority-1'}
                onClick={() => handleFilterChange('priority-1')}
              >
                Média
              </FilterButton>
              <FilterButton
                active={filter === 'priority-2'}
                onClick={() => handleFilterChange('priority-2')}
              >
                Alta
              </FilterButton>
              <FilterButton
                active={filter === 'priority-3'}
                onClick={() => handleFilterChange('priority-3')}
              >
                Crítica
              </FilterButton>
            </FilterContainer>
          </FilterGroup>
        </AdvancedFilters>
      </FilterSection>

      {isFilterLoading ? (
        <FilterLoading 
          filterName={currentFilterName} 
          isVisible={true} 
        />
      ) : safeTasks.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Icon icon={MdAdd} size={64} />
          </EmptyIcon>
          <EmptyTitle>
            {filter === 'all' ? 'Nenhuma tarefa encontrada' : 
             filter === 'my-tasks' ? 'Nenhuma tarefa delegada para você' :
             filter === 'my-pending' ? 'Nenhuma tarefa pendente delegada para você' :
             filter === 'my-high-priority' ? 'Nenhuma tarefa urgente delegada para você' :
             filter.startsWith('status-') ? `Nenhuma tarefa com status ${filter.split('-')[1]}` :
             filter.startsWith('priority-') ? `Nenhuma tarefa com prioridade ${filter.split('-')[1]}` :
             'Nenhuma tarefa encontrada'}
          </EmptyTitle>
          <EmptyText>
            {filter === 'all' 
              ? 'Comece criando sua primeira tarefa!'
              : filter === 'my-tasks'
              ? 'Você não tem tarefas delegadas no momento.'
              : filter === 'my-pending'
              ? 'Você não tem tarefas pendentes delegadas no momento.'
              : filter === 'my-high-priority'
              ? 'Você não tem tarefas urgentes delegadas no momento.'
              : 'Não há tarefas com os filtros selecionados no momento.'
            }
          </EmptyText>
          {filter === 'all' && (
            <Link to="/tasks/new">
              <Button variant="primary" size="large">
                <Icon icon={MdAdd} size={18} style={{ marginRight: '8px' }} />
                Criar Primeira Tarefa
              </Button>
            </Link>
          )}
        </EmptyState>
      ) : (
        <TasksGrid>
          {safeTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TasksGrid>
      )}
    </TaskListContainer>
  );
};

export default TaskList;
