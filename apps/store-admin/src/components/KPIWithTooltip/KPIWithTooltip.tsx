import React from 'react';
import { KPI, Tooltip } from '@baby-toys/ui-kit';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
          <FontAwesomeIcon icon={faCircleInfo} style={{ opacity: 0.7, cursor: 'help' }} />
        </span>
      </Tooltip>
    </span>
  ) : (
    label
  );

  return <KPI label={labelNode} value={value} />;
};

export default KPIWithTooltip;
