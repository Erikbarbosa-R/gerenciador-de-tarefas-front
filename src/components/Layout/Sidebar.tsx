import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  MdList, 
  MdAdd
} from 'react-icons/md';
import { IconType } from 'react-icons';
import Icon from '../UI/Icon';

const SidebarContainer = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: #2c3e50;
  color: white;
  padding: 20px 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 8px;
`;

const NavLink = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: ${({ isActive }) => (isActive ? '#3498db' : 'white')};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: ${({ isActive }) => (isActive ? 'rgba(52, 152, 219, 0.1)' : 'transparent')};
  border-left: 3px solid ${({ isActive }) => (isActive ? '#3498db' : 'transparent')};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #3498db;
  }
`;

const IconContainer = styled.div`
  margin-right: 12px;
  font-size: 18px;
  display: flex;
  align-items: center;
`;

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems: Array<{ path: string; label: string; icon: IconType }> = [
    { path: '/', label: 'Todas as Tarefas', icon: MdList },
    { path: '/tasks/new', label: 'Nova Tarefa', icon: MdAdd },
  ];

  return (
    <SidebarContainer>
      <NavList>
        {navItems.map((item) => (
          <NavItem key={item.path}>
            <NavLink
              to={item.path}
              isActive={location.pathname === item.path}
            >
              <IconContainer>
                <Icon icon={item.icon} size={18} />
              </IconContainer>
              {item.label}
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;
