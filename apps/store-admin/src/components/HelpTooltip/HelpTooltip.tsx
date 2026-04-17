import React from 'react';
import { Tooltip, Flex, Text } from '@baby-toys/ui-kit';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * A small ? icon that shows a contextual help tooltip on hover.
 * Use next to section headings in the admin to explain concepts.
 */
const HelpTooltip: React.FC<HelpTooltipProps> = ({ title, description, position = 'right' }) => {
  const content = (
    <Flex direction="vertical" spacing="xs">
      <Text size="sm" weight="medium">
        {title}
      </Text>
      <Text size="xs">{description}</Text>
    </Flex>
  );

  return (
    <Tooltip content={content} position={position}>
      <HelpCircle size={16} />
    </Tooltip>
  );
};

export default HelpTooltip;
