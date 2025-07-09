import React from 'react';
import { Accordion } from '../Accordion/Accordion.tsx';
import { AccordionGroup } from '../Accordion/AccordionGroup.tsx';
import { Button } from '../Button/Button.tsx';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type MenuItem = {
  label: string;
  icon?: IconDefinition;
  badge?: string | number;
  disabled?: boolean;
  items?: MenuItem[];
  command?: () => void;
};

interface PanelMenuProps {
  model: MenuItem[];
  multiple?: boolean;
  className?: string;
}

export const PanelMenu: React.FC<PanelMenuProps> = ({ model, multiple = false }) => {
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
            onClick={() => item.command?.()}
            isDisabled={item.disabled}
            leftIcon={item.icon}
            fullWidth
            key={idx}
            color="light"
            align="start"
            className="bts-marginLxl"
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
              buttonColor="light"
              buttonAppearance="filled"
              key={index}
              header={item.label}
              disabled={item.disabled}
              withoutPadding
            >
              <div>{renderSubMenu(item.items!)}</div>
            </Accordion>
          );
        } else {
          return (
            <Button
              onClick={() => item.command?.()}
              isDisabled={item.disabled}
              leftIcon={item.icon}
              fullWidth
              key={index}
              color="light"
              align="start"
            >
              {item.label}
            </Button>
          );
        }
      })}
    </AccordionGroup>
  );
};
