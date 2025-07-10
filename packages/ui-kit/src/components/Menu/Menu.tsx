import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Accordion from '../Accordion/Accordion.tsx';
import AccordionGroup from '../Accordion/AccordionGroup.tsx';
import Button from '../Button/Button.tsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type MenuItem = {
  label: string;
  icon?: IconDefinition;
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
}

const Menu: React.FC<PanelMenuProps> = ({ model, multiple = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const renderSubMenu = (items: MenuItem[]) => {
    return items.map((item, idx) => {
      const hasSubmenu = item.items && item.items.length > 0;

      if (hasSubmenu) {
        return (
          <Accordion
            key={idx}
            header={item.label}
            disabled={item.disabled}
            withoutPadding
            buttonColor="light"
            buttonAppearance="filled"
          >
            <div>{renderSubMenu(item.items!)}</div>
          </Accordion>
        );
      } else {
        return (
          <Button
            key={idx}
            onClick={() => {
              if (item.route) {
                navigate(item.route);
              } else {
                item.command?.();
              }
            }}
            isDisabled={item.disabled}
            leftIcon={item.icon}
            fullWidth
            color="light"
            align="start"
            className="bts-marginLxl"
            isSelected={item.route === location.pathname}
          >
            {item.label}
          </Button>
        );
      }
    });
  };

  return (
    <AccordionGroup allowMultipleOpen={multiple} fullWidth>
      {model.map((item, index) => {
        const hasSubmenu = item.items && item.items.length > 0;

        if (hasSubmenu) {
          return (
            <Accordion
              key={index}
              header={item.label}
              disabled={item.disabled}
              withoutPadding
              buttonColor="light"
              buttonAppearance="filled"
            >
              <div>{renderSubMenu(item.items!)}</div>
            </Accordion>
          );
        } else {
          return (
            <Button
              key={index}
              onClick={() => {
                if (item.route) {
                  navigate(item.route);
                } else {
                  item.command?.();
                }
              }}
              isDisabled={item.disabled}
              leftIcon={item.icon}
              fullWidth
              color="light"
              align="start"
              isSelected={item.route === location.pathname}
            >
              {item.label}
            </Button>
          );
        }
      })}
    </AccordionGroup>
  );
};

export default Menu;
