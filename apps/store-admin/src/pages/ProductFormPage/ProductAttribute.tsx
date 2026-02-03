import React, { useMemo, useState } from 'react';
import {
  Flex,
  BouncingDotsLoader,
  Button,
  Table,
  Dialog,
  Select,
  Option,
  Tooltip,
  FieldWrapper,
} from '@baby-toys/ui-kit';
import {
  useOptionTypes,
  useOptionValues,
  attachTypeToProduct,
  attachValueToProduct,
  detachTypeFromProduct,
} from '../../api/optionApi';
import { useVariants } from '../../api/variantApi';
import { useProduct } from '../../api/productApi';
import type { OptionType } from '../../api/types/option';
import { useToast } from '@baby-toys/ui-kit';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

const ProductAttribute: React.FC<{ productId: number }> = ({ productId }) => {
  const toast = useToast();
  const qc = useQueryClient();
  const { data: allTypes = [], isLoading } = useOptionTypes();
  const { data: product } = useProduct(productId);
  const { data: variants = [] } = useVariants(productId);

  // Compute used types in current variants from optionSelectionIds
  const usedTypeIds = useMemo(() => {
    const set = new Set<number>();
    for (const v of variants) {
      const sel = v.optionSelectionIds || {};
      Object.keys(sel).forEach((k) => set.add(Number(k)));
    }
    return set;
  }, [variants]);

  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTypeToAdd, setSelectedTypeToAdd] = useState<number | undefined>(undefined);
  const { data: valuesForSelectedType = [], isLoading: isLoadingValues } =
    useOptionValues(selectedTypeToAdd);
  const [selectedValueIds, setSelectedValueIds] = useState<number[]>([]);

  const attachedTypes: { type: OptionType; valueLabels: string[] }[] = useMemo(() => {
    const byId = new Map<number, OptionType>();
    allTypes.forEach((t) => byId.set(t.id, t));
    const arr: { type: OptionType; valueLabels: string[] }[] = [];
    (product?.options || []).forEach((o: any) => {
      const typeId = o?.type?.id;
      const type = typeId ? byId.get(typeId) : undefined;
      if (type) {
        const valueLabels = Array.isArray(o?.values)
          ? o.values.map((v: any) => v?.display || v?.value).filter(Boolean)
          : [];
        arr.push({ type, valueLabels });
      }
    });
    return arr;
  }, [allTypes, product]);

  const availableTypesToAdd = useMemo(() => {
    const selected = new Set(attachedTypes.map((x) => x.type.id));
    return allTypes.filter((t) => !selected.has(t.id));
  }, [allTypes, attachedTypes]);

  const attachType = async (typeId: number) => {
    setLoadingMap((m) => ({ ...m, [typeId]: true }));
    try {
      // 1) attach type
      await attachTypeToProduct(productId, typeId);
      // 2) attach selected values (whitelist)
      for (const vid of selectedValueIds) {
        await attachValueToProduct(productId, { optionTypeId: typeId, optionValueId: vid });
      }
      toast.success('Option type and values attached');
      qc.invalidateQueries({ queryKey: ['product', productId] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to attach option type');
    } finally {
      setLoadingMap((m) => ({ ...m, [typeId]: false }));
    }
  };

  const detachType = async (typeId: number) => {
    if (usedTypeIds.has(typeId)) {
      toast.error(
        'Cannot detach: type is used by existing variations. Remove or update variations first.'
      );
      return;
    }
    setLoadingMap((m) => ({ ...m, [typeId]: true }));
    try {
      await detachTypeFromProduct(productId, typeId);
      toast.success('Option type detached');
      qc.invalidateQueries({ queryKey: ['product', productId] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to detach option type');
    } finally {
      setLoadingMap((m) => ({ ...m, [typeId]: false }));
    }
  };

  if (isLoading) {
    return (
      <Flex align="center" justify="center">
        <BouncingDotsLoader />{' '}
      </Flex>
    );
  }

  return (
    <Flex fullWidth direction="vertical" spacing="l">
      <Flex justify="end" align="center" fullWidth>
        <Button
          onClick={() => setShowAddDialog(true)}
          isDisabled={isLoading || availableTypesToAdd.length === 0}
        >
          Add option type
        </Button>
      </Flex>
      <Table
        value={attachedTypes}
        emptyMessage="No option types attached yet."
        columns={
          [
            { header: 'Option Type', field: 'type.name', body: (row: any) => row.type.name },
            {
              header: 'Values',
              field: 'values',
              body: (row: any) => (row.valueLabels?.length ? row.valueLabels.join(', ') : '-'),
            },
            {
              header: 'Actions',
              field: 'actions',
              body: (row: any) => {
                const tid = row.type.id as number;
                const blocked = usedTypeIds.has(tid);
                const btn = (
                  <Button
                    size="small"
                    appearance="outline"
                    leftIconComp={Trash2}
                    onClick={() => detachType(tid)}
                    isDisabled={blocked || !!loadingMap[tid]}
                  />
                );
                return blocked ? (
                  <Tooltip content="Used by variations. Update variations first.">{btn}</Tooltip>
                ) : (
                  btn
                );
              },
            },
          ] as any
        }
        paginator={false}
        stripedRows
      />

      <Dialog
        header="Add Option Type"
        visible={showAddDialog}
        onVisibleChange={(v: boolean) => {
          setShowAddDialog(v as any);
          if (!v) {
            // reset dialog state when closed
            setSelectedTypeToAdd(undefined);
            setSelectedValueIds([]);
          }
        }}
      >
        <Flex direction="vertical" spacing="m" fullWidth>
          <FieldWrapper label="Option type" fullWidth>
            <Select
              fullWidth
              value={selectedTypeToAdd}
              onChange={(v) => setSelectedTypeToAdd(Number(v))}
            >
              {availableTypesToAdd.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </FieldWrapper>
          {selectedTypeToAdd && (
            <FieldWrapper label="Values" fullWidth>
              <Select
                multiple
                fullWidth
                placeholder={isLoadingValues ? 'Loading values...' : 'Select values'}
                value={selectedValueIds}
                onChange={(vals) =>
                  setSelectedValueIds((Array.isArray(vals) ? vals : [vals]).map(Number))
                }
              >
                {valuesForSelectedType.map((val) => (
                  <Option key={val.id} value={val.id}>
                    {val.display || val.value}
                  </Option>
                ))}
              </Select>
            </FieldWrapper>
          )}
          <Flex justify="end" spacing="s">
            <Button appearance="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (selectedTypeToAdd) {
                  await attachType(selectedTypeToAdd);
                  setShowAddDialog(false);
                  setSelectedTypeToAdd(undefined);
                  setSelectedValueIds([]);
                }
              }}
              isDisabled={!selectedTypeToAdd || selectedValueIds.length === 0}
            >
              Add
            </Button>
          </Flex>
        </Flex>
      </Dialog>
    </Flex>
  );
};

export default ProductAttribute;
