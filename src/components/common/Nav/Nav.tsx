import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Flex from '../../common/Flex/Flex.tsx';
import { Button } from '../Button/Button.tsx';

type NavItem = {
  path: string;
  label: string;
  icon?: IconDefinition;
};

type NavProps = {
  config: NavItem[];
  isActivePath?: (navPath: string, currentPath: string) => boolean;
};

export const Nav: React.FC<NavProps> = ({ config, isActivePath }) => {
  const location = useLocation();

  return (
    <Flex spacing="l">
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
            <Button appearance="link" size="medium" leftIcon={icon} isSelected={isActive}>
              {label}
            </Button>
          </NavLink>
        );
      })}
    </Flex>
  );
};
