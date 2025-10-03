export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Não informado';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn('Data inválida recebida:', dateString);
      return 'Data inválida';
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error, 'Data recebida:', dateString);
    return 'Erro na data';
  }
};

export const formatDateOnly = (dateString: string | undefined): string => {
  if (!dateString) return 'Não informado';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn('Data inválida recebida:', dateString);
      return 'Data inválida';
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo',
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error, 'Data recebida:', dateString);
    return 'Erro na data';
  }
};

export const formatTimeOnly = (dateString: string | undefined): string => {
  if (!dateString) return 'Não informado';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn('Data inválida recebida:', dateString);
      return 'Data inválida';
    }
    
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });
  } catch (error) {
    console.error('Erro ao formatar horário:', error, 'Data recebida:', dateString);
    return 'Erro no horário';
  }
};

export const isOverdue = (dueDate: string | undefined, status: number): boolean => {
  if (!dueDate || status === 2) return false;
  
  try {
    const due = new Date(dueDate);
    const now = new Date();
    
    const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return dueDateOnly < nowDateOnly;
  } catch (error) {
    console.error('Erro ao verificar se está vencida:', error);
    return false;
  }
};