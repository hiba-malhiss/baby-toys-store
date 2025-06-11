import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Flex from '../../layout/Flex/Flex.tsx';
import { Button } from '../Button/Button.tsx';

type NavItem = {
  path: string;
  label: string;
  icon?: IconDefinition;
};

type NavProps = {
  config: NavItem[];
};

export const Nav: React.FC<NavProps> = ({ config }) => {
  return (
    <Flex spacing="s">
      {config.map(({ path, label, icon }) => (
        <NavLink key={path} to={path} end className={({ isActive }) => clsx(isActive && 'active')}>
          {({ isActive }) => (
            <Button appearance="link" size="medium" leftIcon={icon} isSelected={isActive}>
              {label}
            </Button>
          )}
        </NavLink>
      ))}
    </Flex>
  );
};
