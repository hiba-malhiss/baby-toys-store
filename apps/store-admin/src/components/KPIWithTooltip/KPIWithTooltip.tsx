import React from 'react';
import { KPI, Tooltip } from '@baby-toys/ui-kit';
import { Info } from 'lucide-react';

export type KPIWithTooltipProps = {
  label: string;
  value?: React.ReactNode;
  tooltip?: string;
};

const KPIWithTooltip: React.FC<KPIWithTooltipProps> = ({ label, value, tooltip }) => {
  const labelNode = tooltip ? (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span>{label}</span>
      <Tooltip
        content={
          <div style={{ maxWidth: 200, whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {tooltip}
          </div>
        }
        position="top"
      >
        <span>
          <Info style={{ opacity: 0.7, cursor: 'help', width: 16, height: 16 }} />
        </span>
      </Tooltip>
    </span>
  ) : (
    label
  );

  return <KPI label={labelNode} value={value} />;
};

export default KPIWithTooltip;
