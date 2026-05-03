import React from 'react';
import { Flex, KPI, Tooltip } from '@baby-toys/ui-kit';
import { Info } from 'lucide-react';

export type KPIWithTooltipProps = {
  label: string;
  value?: React.ReactNode;
  tooltip?: string;
};

const KPIWithTooltip: React.FC<KPIWithTooltipProps> = ({ label, value, tooltip }) => {
  const labelNode = tooltip ? (
    <Flex spacing="xs" wrap>
      <span>{label}</span>
      <Tooltip content={tooltip} position="top">
        <span>
          <Info style={{ opacity: 0.7, cursor: 'help', width: 16, height: 16 }} />
        </span>
      </Tooltip>
    </Flex>
  ) : (
    label
  );

  return <KPI label={labelNode} value={value} />;
};

export default KPIWithTooltip;
