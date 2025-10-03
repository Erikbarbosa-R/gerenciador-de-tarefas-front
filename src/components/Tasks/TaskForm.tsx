import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Textarea from '../UI/Textarea';
import Select from '../UI/Select';
import LoadingSpinner from '../UI/LoadingSpinner';
import { useTasks } from '../../contexts/TaskContext';
import { useUsers } from '../../contexts/UserContext';
import { CreateTaskData, UpdateTaskData, TaskPriority } from '../../types';
import UserSelector from '../UI/UserSelector';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  font вес: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById, createTask, updateTask, loading } = useTasks();
  const { users, loading: usersLoading } = useUsers();
  const navigate = useNavigate();
  
  const isEditing = !!id;
  const task = id ? getTaskById(id) : undefined;

  // Obter data mínima (hoje)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    userId: '',
    priority: TaskPriority.MEDIUM,
    dueDate: getMinDate(),
    assignedToUserId: '',
  });
  
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && task) {
      setFormData({
        title: task.title,
        description: task.description,
        userId: task.userId,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignedToUserId: task.assignedToUserId || '',
      });
    }
  }, [isEditing, task]);

  const priorityOptions = [
    { value: TaskPriority.LOW.toString(), label: 'Baixa' },
    { value: TaskPriority.MEDIUM.toString(), label: 'Média' },
    { value: TaskPriority.HIGH.toString(), label: 'Alta' },
    { value: TaskPriority.CRITICAL.toString(), label: 'Crítica' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? Number(value) : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validar data de vencimento
    if (formData.dueDate && formData.dueDate < getMinDate()) {
      setError('A data de vencimento deve ser a partir de hoje');
      setSubmitting(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        dueDate: formData.dueDate || undefined,
      };

      if (isEditing && task) {
        await updateTask(task.id, submitData as UpdateTaskData);
      } else {
        await createTask(submitData);
      }
      
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Erro ao salvar tarefa');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading && isEditing) {
    return <LoadingSpinner />;
  }

  if (isEditing && !task) {
    return (
      <FormContainer>
        <ErrorMessage>
          Tarefa não encontrada.
        </ErrorMessage>
        <ButtonGroup>
          <Button variant="secondary" onClick={handleCancel}>
            Voltar
          </Button>
        </ButtonGroup>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Title>{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormGroup>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Digite o título da tarefa"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Descreva os detalhes da tarefa"
            rows={4}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="priority">Prioridade</Label>
          <Select
            id="priority"
            name="priority"
            options={priorityOptions}
            value={formData.priority?.toString() || '0'}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="dueDate">Data de Vencimento</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate || ''}
            onChange={handleChange}
            min={getMinDate()}
          />
        </FormGroup>

        <FormGroup>
          <UserSelector
            users={users}
            selectedUserId={formData.assignedToUserId}
            onUserChange={(userId) => setFormData(prev => ({ ...prev, assignedToUserId: userId || '' }))}
            label="Atribuir para (opcional)"
            placeholder="Selecione um usuário"
            loading={usersLoading}
          />
        </FormGroup>

        <ButtonGroup>
          <Button variant="secondary" onClick={handleCancel} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default TaskForm;