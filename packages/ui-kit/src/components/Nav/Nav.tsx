import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Flex from '../Flex/Flex.tsx';
import Button from '../Button/Button.tsx';

type NavItem = {
  path: string;
  label: string;
  icon?: IconDefinition;
};

type NavProps = {
  config: NavItem[];
  isActivePath?: (navPath: string, currentPath: string) => boolean;
  direction: 'horizontal' | 'vertical';
};

const Nav: React.FC<NavProps> = ({ config, isActivePath, direction = 'horizontal' }) => {
  const location = useLocation();

  return (
    <Flex spacing="l" direction={direction}>
      {config.map(({ path, label, icon }) => {
        const isActive = isActivePath
          ? isActivePath(path, location.pathname)
          : location.pathname === path;

        return (
          <NavLink
            key={path}
            to={path}
            className={() => clsx(isActive && 'active')}
            end={!isActivePath}
          >
            <Button
              appearance="link"
              color="primary"
              size="medium"
              leftIcon={icon}
              isSelected={isActive}
              withoutPadding={direction === 'vertical'}
            >
              {label}
            </Button>
          </NavLink>
        );
      })}
    </Flex>
  );
};

export default Nav;
