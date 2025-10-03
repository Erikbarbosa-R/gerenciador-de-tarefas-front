import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTasks } from '../../contexts/TaskContext';
import { useUsers } from '../../contexts/UserContext';
import { Task } from '../../types';
import Button from '../UI/Button';
import UserSelector from '../UI/UserSelector';
import LoadingSpinner from '../UI/LoadingSpinner';
import { 
  MdArrowBack, 
  MdEdit, 
  MdDelete, 
  MdCalendarToday,
  MdWarning
} from 'react-icons/md';
import Icon from '../UI/Icon';
import { formatDate, isOverdue } from '../../utils/dateUtils';

const DetailsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid #007bff;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
`;

const TaskCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-left: 6px solid ${({ completed }) => (completed ? '#28a745' : '#007bff')};
`;

const Title = styled.h1.withConfig({
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>`
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

const PriorityBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'priority',
})<{ priority: string }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ priority }) => {
    switch (priority) {
      case 'critical':
        return '#f8d7da';
      case 'high':
        return '#f8d7da';
      case 'medium':
        return '#fff3cd';
      case 'low':
        return '#d4edda';
      default:
        return '#e2e3e5';
    }
  }};
  color: ${({ priority }) => {
    switch (priority) {
      case 'critical':
        return '#721c24';
      case 'high':
        return '#721c24';
      case 'medium':
        return '#856404';
      case 'low':
        return '#155724';
      default:
        return '#383d41';
    }
  }};
`;

const StatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ completed }) => (completed ? '#d4edda' : '#fff3cd')};
  color: ${({ completed }) => (completed ? '#155724' : '#856404')};
`;

const Description = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'completed',
})<{ completed?: boolean }>`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  line-height: 1.6;
  color: #333;
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
`;

const Dates = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const DateItem = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
`;

const DateLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
`;

const DateValue = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
  text-align: center;
`;

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById, updateTask, deleteTask, assignTask, loading } = useTasks();
  const { users, loading: usersLoading } = useUsers();
  const navigate = useNavigate();

  const task = id ? getTaskById(id) : undefined;

  const handleToggleComplete = async () => {
    if (!task) return;
    
    try {
      // Alternar entre COMPLETED (2) e PENDING (0)
      const newStatus = isTaskCompleted(task) ? 0 : 2;
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(task.id);
        navigate('/');
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
      }
    }
  };

  const handleAssignTask = async (assignedToUserId: string | null) => {
    if (!task) return;
    
    try {
      await assignTask(task.id, assignedToUserId);
    } catch (error) {
      console.error('Erro ao atribuir tarefa:', error);
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 3:
        return 'Crítica';
      case 2:
        return 'Alta';
      case 1:
        return 'Média';
      case 0:
        return 'Baixa';
      default:
        return 'Não definida';
    }
  };

  const getPriorityString = (priority: number) => {
    switch (priority) {
      case 3:
        return 'critical';
      case 2:
        return 'high';
      case 1:
        return 'medium';
      case 0:
        return 'low';
      default:
        return 'unknown';
    }
  };

  const isTaskCompleted = (task: Task) => {
    return task.status === 2; // TaskStatus.COMPLETED
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!task) {
    return (
      <DetailsContainer>
        <ErrorMessage>
          Tarefa não encontrada
        </ErrorMessage>
        <BackButton to="/">
          ← Voltar para a lista
        </BackButton>
      </DetailsContainer>
    );
  }

  const isOverdueTask = task ? isOverdue(task.dueDate, task.status) : false;

  return (
    <DetailsContainer>
      <Header>
        <BackButton to="/">
          <Icon icon={MdArrowBack} size={16} />
          Voltar para a lista
        </BackButton>
      </Header>

      <TaskCard completed={isTaskCompleted(task)}>
        <Title completed={isTaskCompleted(task)}>{task.title}</Title>
        
        <MetaInfo>
          <MetaItem>
            <PriorityBadge priority={getPriorityString(task.priority)}>
              Prioridade: {getPriorityLabel(task.priority)}
            </PriorityBadge>
          </MetaItem>
          
          <MetaItem>
            <StatusBadge completed={isTaskCompleted(task)}>
              {isTaskCompleted(task) ? 'Concluída' : 'Pendente'}
            </StatusBadge>
          </MetaItem>
          
          {isOverdueTask && (
            <MetaItem>
              <Icon icon={MdWarning} size={16} color="#dc3545" />
              <span style={{ color: '#dc3545', fontWeight: '500' }}>
                Atrasada
              </span>
            </MetaItem>
          )}
        </MetaInfo>

        {task.description && (
          <Description completed={isTaskCompleted(task)}>
            {task.description}
          </Description>
        )}

        <Dates>
          <DateItem>
            <DateLabel>Criada em</DateLabel>
            <DateValue>{formatDate(task.createdAt)}</DateValue>
          </DateItem>
          
          <DateItem>
            <DateLabel>Última atualização</DateLabel>
            <DateValue>{formatDate(task.updatedAt)}</DateValue>
          </DateItem>
          
          {task.dueDate && (
            <DateItem>
              <DateLabel>
                <Icon icon={MdCalendarToday} size={16} style={{ marginRight: '4px' }} />
                Prazo
              </DateLabel>
              <DateValue style={{ color: isOverdueTask ? '#dc3545' : '#333' }}>
                {formatDate(task.dueDate)}
              </DateValue>
            </DateItem>
          )}
        </Dates>
        
        {/* Seção de Atribuição */}
        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#333' }}>Atribuir Tarefa</h3>
          <UserSelector
            users={users}
            selectedUserId={task.assignedToUserId}
            onUserChange={handleAssignTask}
            label="Delegar para"
            placeholder="Selecione um usuário para atribuir esta tarefa"
            loading={usersLoading}
          />
          {task.assignedToUserId && (
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
              Atribuída para: {users.find(u => u.id === task.assignedToUserId)?.name || 'Usuário não encontrado'}
            </div>
          )}
        </div>
        
        <Actions>
          <Button
            variant={isTaskCompleted(task) ? 'secondary' : 'success'}
            onClick={handleToggleComplete}
          >
            {isTaskCompleted(task) ? 'Marcar como Pendente' : 'Marcar como Concluída'}
          </Button>
          
          <Link to={`/tasks/${task.id}/edit`}>
            <Button variant="secondary">
              <Icon icon={MdEdit} size={16} style={{ marginRight: '4px' }} />
              Editar
            </Button>
          </Link>
          
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            <Icon icon={MdDelete} size={16} style={{ marginRight: '4px' }} />
            Excluir
          </Button>
        </Actions>
      </TaskCard>
    </DetailsContainer>
  );
};

export default TaskDetails;
