import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Accordion from '../Accordion/Accordion.tsx';
import AccordionGroup from '../Accordion/AccordionGroup.tsx';
import Button from '../Button/Button.tsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { ComponentType } from 'react';
import { Flex } from '../index';
import { Spacing } from '../Flex/Flex';

export type MenuItem = {
  label: string;
  icon?: IconDefinition;
  iconName?: string;
  iconComp?: ComponentType<any> | null;
  badge?: string | number;
  disabled?: boolean;
  items?: MenuItem[];
  command?: () => void;
  route?: string;
};

interface PanelMenuProps {
  model: MenuItem[];
  multiple?: boolean;
  className?: string;
  spacing?: Spacing;
  autoOverflow?: boolean;
}

const Menu: React.FC<PanelMenuProps> = ({
  spacing,
  model,
  multiple = false,
  autoOverflow = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check recursively if current route is in the subtree
  const isRouteInSubtree = (items: MenuItem[] = []): boolean => {
    return items.some((item) => {
      if (item.route === location.pathname) return true;
      if (item.items) return isRouteInSubtree(item.items);
      return false;
    });
  };

  const renderSubMenu = (items: MenuItem[] = []) => {
    return (items ?? []).map((item, idx) => {
      const hasSubmenu = Array.isArray(item.items) && item.items.length > 0;

      if (hasSubmenu) {
        const isOpen = isRouteInSubtree(item.items ?? []);

        return (
          <Accordion
            key={idx}
            header={item.label}
            disabled={item.disabled}
            withoutHeaderPadding
            buttonAppearance="link"
            unstyled
            defaultOpen={isOpen}
          >
            <div>{renderSubMenu(item.items ? item.items : [])}</div>
          </Accordion>
        );
      }

      return (
        <Button
          key={idx}
          appearance="link"
          onClick={() => {
            if (item.route) {
              navigate(item.route);
            } else {
              item.command?.();
            }
          }}
          isDisabled={item.disabled}
          leftIcon={item.icon}
          leftIconName={item.iconName}
          leftIconComp={item.iconComp}
          fullWidth
          align="start"
          withoutPadding
          className="bts-marginLxl"
          isSelected={item.route === location.pathname}
        >
          {item.label}
        </Button>
      );
    });
  };

  return (
    <AccordionGroup allowMultipleOpen={multiple} fullWidth unstyled autoOverflow={autoOverflow}>
      <Flex direction="vertical" spacing={spacing}>
        {model.map((item, index) => {
          const hasSubmenu = Array.isArray(item.items) && item.items.length > 0;
          const isOpen = hasSubmenu ? isRouteInSubtree(item.items ?? []) : false;

          if (hasSubmenu) {
            return (
              <Accordion
                key={index}
                header={item.label}
                disabled={item.disabled}
                withoutPadding
                buttonAppearance="link"
                withoutHeaderPadding
                unstyled
                defaultOpen={isOpen}
              >
                <div>{renderSubMenu(item.items ?? [])}</div>
              </Accordion>
            );
          } else {
            return (
              <Button
                key={index}
                withoutPadding
                onClick={() => {
                  if (item.route) {
                    navigate(item.route);
                  } else {
                    item.command?.();
                  }
                }}
                isDisabled={item.disabled}
                leftIcon={item.icon}
                leftIconName={item.iconName}
                leftIconComp={item.iconComp}
                fullWidth
                appearance="link"
                align="start"
                isSelected={item.route === location.pathname}
              >
                {item.label}
              </Button>
            );
          }
        })}
      </Flex>
    </AccordionGroup>
  );
};

export default Menu;
