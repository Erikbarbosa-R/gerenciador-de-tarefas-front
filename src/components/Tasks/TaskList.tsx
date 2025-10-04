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
  display: block;
  visibility: visible;
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
  visibility: visible;
  opacity: 1;
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

type FilterType = 'all' | 'my-tasks' | 'my-pending' | 'my-completed';

const TaskList: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    refreshTasks,
    getMyTasks,
    getMyPendingTasks,
    getMyCompletedTasks
  } = useTasks();
  const [filter, setFilter] = useState<FilterType>('all');
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
          </FilterContainer>
        </FilterGroup>
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
             filter === 'my-completed' ? 'Nenhuma tarefa concluída delegada para você' :
             'Nenhuma tarefa encontrada'}
          </EmptyTitle>
          <EmptyText>
            {filter === 'all' 
              ? 'Comece criando sua primeira tarefa!'
              : filter === 'my-tasks'
              ? 'Você não tem tarefas delegadas no momento.'
              : filter === 'my-pending'
              ? 'Você não tem tarefas pendentes delegadas no momento.'
              : filter === 'my-completed'
              ? 'Você não tem tarefas concluídas delegadas no momento.'
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
