import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Task, UpdateTaskData } from '../../types';
import Button from '../UI/Button';
import { useTasks } from '../../contexts/TaskContext';
import { MdCalendarToday, MdDelete } from 'react-icons/md';
import Icon from '../UI/Icon';
import { formatDateOnly, isOverdue } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
}

const Card = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'completed' && prop !== 'status',
})<{ completed?: boolean; status?: number }>`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border-left: 4px solid ${({ status }) => {
    switch (status) {
      case 2: return '#28a745'; // COMPLETED
      case 1: return '#ffc107'; // IN_PROGRESS
      case 3: return '#dc3545'; // CANCELLED
      default: return '#007bff'; // PENDING
    }
  }};
  opacity: ${({ status }) => (status === 2 ? 0.8 : 1)};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const Title = styled.h3.withConfig({
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status?: number }>`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-decoration: ${({ status }) => (status === 2 ? 'line-through' : 'none')};
  flex: 1;
  margin-right: 12px;
`;

const PriorityBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'priority',
})<{ priority: number }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ priority }) => {
    switch (priority) {
      case 2:
        return '#f8d7da';
      case 1:
        return '#fff3cd';
      case 0:
        return '#d4edda';
      case 3:
        return '#f5c6cb';
      default:
        return '#e2e3e5';
    }
  }};
  color: ${({ priority }) => {
    switch (priority) {
      case 2:
        return '#721c24';
      case 1:
        return '#856404';
      case 0:
        return '#155724';
      default:
        return '#383d41';
    }
  }};
`;

const Description = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status?: number }>`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  text-decoration: ${({ status }) => (status === 2 ? 'line-through' : 'none')};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const DueDate = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'overdue',
})<{ overdue?: boolean }>`
  font-size: 12px;
  color: ${({ overdue }) => (overdue ? '#dc3545' : '#666')};
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  
  button {
    pointer-events: auto;
  }
`;

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();


  const handleDelete = async (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Previne o clique do card
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(task.id);
      } catch (error) {
      }
    }
  };

  const handleCardClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  const handleToggleComplete = async (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Previne o clique do card
    try {
      const newStatus = task.status === 2 ? 0 : 2; // Alternar entre PENDING e COMPLETED
      
      // Preservar a delegação ao alterar o status
      const updateData: UpdateTaskData = { 
        status: newStatus,
        assignedToUserId: task.assignedToUserId // Manter a delegação atual
      };
      
      await updateTask(task.id, updateData);
    } catch (error) {
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 2:
        return 'Alta';
      case 1:
        return 'Média';
      case 0:
        return 'Baixa';
      case 3:
        return 'Crítica';
      default:
        return 'Não definida';
    }
  };

  const isOverdueTask = isOverdue(task.dueDate, task.status);

  return (
    <Card status={task.status} onClick={handleCardClick}>
      <Header>
        <Title status={task.status}>{task.title}</Title>
        <PriorityBadge priority={task.priority}>
          {getPriorityLabel(task.priority)}
        </PriorityBadge>
      </Header>

      {task.description && (
        <Description status={task.status}>
          {task.description}
        </Description>
      )}

      <Footer>
        {task.dueDate && (
          <DueDate overdue={isOverdueTask}>
            <Icon icon={MdCalendarToday} size={14} style={{ marginRight: '4px' }} />
            {formatDateOnly(task.dueDate)}
          </DueDate>
        )}
        
        <Actions>
          <Button
            variant={task.status === 2 ? 'secondary' : 'success'}
            size="small"
            onClick={handleToggleComplete}
          >
            {task.status === 2 ? 'Desfazer' : 'Concluir'}
          </Button>
          
          <Button
            variant="danger"
            size="small"
            onClick={handleDelete}
          >
            <Icon icon={MdDelete} size={14} style={{ marginRight: '4px' }} />
            Excluir
          </Button>
        </Actions>
      </Footer>
    </Card>
  );
};

export default TaskCard;
