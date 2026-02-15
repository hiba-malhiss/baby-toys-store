import React, { useMemo } from 'react';
import { Select } from '@baby-toys/ui-kit';
import { useActiveTowns, type DeliveryTown } from '../../api/locationsApi';
import { useIsRtl } from '../../utils/i18n';

export interface TownSelectProps {
  value?: string;
  onChange?: (val: string) => void;
  hasError?: string | boolean;
  placeholder?: string;
  isDisabled?: boolean;
  id?: string;
  className?: string;
  onTownChange?: (town: DeliveryTown | null) => void;
}

const TownSelect: React.FC<TownSelectProps> = ({
  value,
  onChange,
  hasError,
  placeholder,
  isDisabled,
  id,
  className,
  ...rest
}) => {
  const { data: towns = [], isPending } = useActiveTowns();
  const isRtl = useIsRtl();

  const computedOptions = useMemo(
    () =>
      towns?.map((o: DeliveryTown) => ({
        label: `${o.displayName} (${o.zoneDisplayName?.toLowerCase()})`,
        value: o.code,
      })),
    [towns, isRtl]
  );

  const handleChange = (val: string) => {
    onChange?.(val);
  };

  return (
    <Select
      value={value}
      onChange={handleChange as any}
      options={computedOptions}
      isLoading={isPending}
      placeholder={placeholder}
      hasError={hasError as any}
      isDisabled={isDisabled}
      className={className}
      id={id}
      isSearchableInternally
      {...rest}
    />
  );
};

export default TownSelect;
