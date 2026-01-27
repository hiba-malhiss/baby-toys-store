import React, { useMemo, useState } from 'react';
import { Button, Chip, Dialog, Flex, StringInput } from '@baby-toys/ui-kit';
import styles from './admin-audit-logs-dialog.module.scss';
import { useTranslation } from 'react-i18next';
import { useAdminAuditLog } from '../../../api/auditApi';
import { diffJson, safeParseJson, summarizeValue, type ChangeType } from './jsonDiff';

type Props = {
  open: boolean;
  logId?: number;
  onClose: () => void;
};

const AdminAuditDetailDialog: React.FC<Props> = ({ open, logId, onClose }) => {
  const { t } = useTranslation();
  const { data: detail, isLoading: isDetailLoading } = useAdminAuditLog(open ? logId : undefined);

  // Diff UI controls
  const [changeSearch, setChangeSearch] = useState('');
  const [showRaw, setShowRaw] = useState(false);

  // Reset local state whenever dialog is (re)opened
  React.useEffect(() => {
    if (open) {
      setShowRaw(false);
      setChangeSearch('');
    }
  }, [open]);

  const parsed = useMemo(() => {
    const before = safeParseJson(detail?.beforeJson);
    const after = safeParseJson(detail?.afterJson);
    return { before, after };
  }, [detail?.beforeJson, detail?.afterJson]);

  const diffResult = useMemo(() => {
    if (!open) return { changes: [] as any[], truncated: false };
    if (!parsed.before.ok || !parsed.after.ok) {
      return { changes: [] as any[], truncated: false };
    }
    const { changes, truncated } = diffJson(
      parsed.before.value ?? undefined,
      parsed.after.value ?? undefined,
      200
    );
    return { changes, truncated };
  }, [open, parsed.before.ok, parsed.after.ok, parsed.before.value, parsed.after.value]);

  const filteredChanges = useMemo(() => {
    const q = changeSearch.trim().toLowerCase();
    if (!q) return diffResult.changes;
    return diffResult.changes.filter((c: any) => {
      const hay = `${c.path} ${summarizeValue(c.before)} ${summarizeValue(c.after)}`.toLowerCase();
      return hay.includes(q);
    });
  }, [diffResult.changes, changeSearch]);

  const renderChangeTypeChip = (type: ChangeType) => {
    const map: Record<ChangeType, { label: string; appearance: any }> = {
      added: { label: t('auditLogs.added', { defaultValue: 'Added' }), appearance: 'success' },
      removed: {
        label: t('auditLogs.removed', { defaultValue: 'Removed' }),
        appearance: 'warning',
      },
      updated: { label: t('auditLogs.updated', { defaultValue: 'Updated' }), appearance: 'info' },
      'type-changed': {
        label: t('auditLogs.typeChanged', { defaultValue: 'Type changed' }),
        appearance: 'warning',
      },
    };
    const cfg = map[type];
    return <Chip label={cfg.label} appearance={cfg.appearance} />;
  };

  const rawFallbackBlock = () => {
    const beforeText = parsed.before.ok
      ? JSON.stringify(parsed.before.value, null, 2)
      : String(parsed.before.value ?? '');
    const afterText = parsed.after.ok
      ? JSON.stringify(parsed.after.value, null, 2)
      : String(parsed.after.value ?? '');

    // If both parse OK, show line-diff with highlights; else fallback to plain pre blocks
    const bothOk = parsed.before.ok && parsed.after.ok;

    const renderLines = (
      lines: { text: string; type: 'same' | 'added' | 'removed' | 'changed' }[]
    ) => (
      <div className={styles.rawPreLines}>
        {lines.map((l, idx) => (
          <div
            key={idx}
            className={`${styles.rawLine} ${
              l.type === 'added'
                ? styles.added
                : l.type === 'removed'
                  ? styles.removed
                  : l.type === 'changed'
                    ? styles.changed
                    : ''
            }`}
          >
            {l.text}
          </div>
        ))}
      </div>
    );

    const computeLineDiff = (a: string, b: string) => {
      const aLines = a.split('\n');
      const bLines = b.split('\n');
      const n = aLines.length,
        m = bLines.length;
      // LCS dp
      const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
      for (let i = n - 1; i >= 0; i--) {
        for (let j = m - 1; j >= 0; j--) {
          if (aLines[i] === bLines[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
          else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
      // reconstruct
      const left: { text: string; type: 'same' | 'added' | 'removed' | 'changed' }[] = [];
      const right: { text: string; type: 'same' | 'added' | 'removed' | 'changed' }[] = [];
      let i = 0,
        j = 0;
      while (i < n && j < m) {
        if (aLines[i] === bLines[j]) {
          left.push({ text: aLines[i], type: 'same' });
          right.push({ text: bLines[j], type: 'same' });
          i++;
          j++;
        } else if (dp[i + 1][j] >= dp[i][j + 1]) {
          left.push({ text: aLines[i], type: 'removed' });
          right.push({ text: '', type: 'removed' });
          i++;
        } else {
          left.push({ text: '', type: 'added' });
          right.push({ text: bLines[j], type: 'added' });
          j++;
        }
      }
      while (i < n) {
        left.push({ text: aLines[i], type: 'removed' });
        right.push({ text: '', type: 'removed' });
        i++;
      }
      while (j < m) {
        left.push({ text: '', type: 'added' });
        right.push({ text: bLines[j], type: 'added' });
        j++;
      }
      // mark pairs where both sides have non-empty and not equal as changed
      for (let k = 0; k < left.length; k++) {
        if (left[k].text && right[k].text && left[k].text !== right[k].text) {
          left[k].type = 'changed';
          right[k].type = 'changed';
        }
      }
      return { left, right };
    };

    const diff = bothOk ? computeLineDiff(beforeText, afterText) : null;

    return (
      <Flex direction="vertical" spacing="m" fullWidth>
        {(!parsed.before.ok || !parsed.after.ok) && (
          <div className={styles.parseError}>
            {t('auditLogs.invalidJson', {
              defaultValue: 'Unable to diff: invalid JSON stored in logs.',
            })}
          </div>
        )}
        <Flex spacing="l" fullWidth className={styles.rawGrid}>
          <div className={styles.rawCol}>
            <div className={styles.rawTitle}>
              {t('auditLogs.before', { defaultValue: 'Before' })}
            </div>
            {bothOk ? renderLines(diff!.left) : <pre className={styles.rawPre}>{beforeText}</pre>}
          </div>
          <div className={styles.rawCol}>
            <div className={styles.rawTitle}>{t('auditLogs.after', { defaultValue: 'After' })}</div>
            {bothOk ? renderLines(diff!.right) : <pre className={styles.rawPre}>{afterText}</pre>}
          </div>
        </Flex>
      </Flex>
    );
  };

  return (
    <Dialog
      visible={open}
      onHide={onClose}
      header={t('auditLogs.changeDetails', { defaultValue: 'Change Details' })}
      fullWidth
    >
      <Flex direction="vertical" spacing="m" fullWidth>
        <div className={styles.detailHeader}>
          <div className={styles.detailMeta}>
            <div className={styles.detailTitle}>
              {detail?.entity} <span className={styles.detailDim}>#{detail?.entityId}</span>
            </div>
            <div className={styles.detailSub}>
              {detail?.action} • {detail?.path} • {detail?.ip}
            </div>
          </div>

          <div className={styles.detailActions}>
            <Button
              appearance={showRaw ? 'filled' : 'outline'}
              onClick={() => setShowRaw((v) => !v)}
            >
              {showRaw
                ? t('auditLogs.hideRaw', { defaultValue: 'Hide raw' })
                : t('auditLogs.showRaw', { defaultValue: 'Show raw' })}
            </Button>
          </div>
        </div>

        {/* Summary removed per request */}

        {/* Filters */}
        {!showRaw && (
          <Flex spacing="s" align="center" fullWidth className={styles.changeToolbar}>
            <StringInput
              placeholder={t('auditLogs.searchChanges', {
                defaultValue: 'Search changes (field/value)',
              })}
              fullWidth
              value={changeSearch}
              onChange={(v) => setChangeSearch(v)}
            />
          </Flex>
        )}

        {/* Main content */}
        {isDetailLoading ? (
          <div className={styles.loadingBlock}>
            {t('app.loading', { defaultValue: 'Loading…' })}
          </div>
        ) : (
          <>
            {!showRaw ? (
              <div className={styles.changesList}>
                {!parsed.before.ok || !parsed.after.ok ? (
                  rawFallbackBlock()
                ) : filteredChanges.length === 0 ? (
                  <div className={styles.emptyState}>
                    {t('auditLogs.noChanges', { defaultValue: 'No changes found.' })}
                  </div>
                ) : (
                  <div className={styles.changeTable}>
                    <div className={`${styles.changeRow} ${styles.changeHeader}`}>
                      <div>{t('auditLogs.field', { defaultValue: 'Field' })}</div>
                      <div>{t('auditLogs.changeType', { defaultValue: 'Type' })}</div>
                      <div>{t('auditLogs.from', { defaultValue: 'From' })}</div>
                      <div>{t('auditLogs.to', { defaultValue: 'To' })}</div>
                    </div>

                    {filteredChanges.map((c: any, idx: number) => (
                      <div key={`${c.path}-${idx}`} className={styles.changeRow}>
                        <div className={styles.pathCell} title={c.path}>
                          {c.path}
                        </div>
                        <div className={styles.typeCell}>{renderChangeTypeChip(c.type)}</div>
                        <div className={styles.valueCell} title={summarizeValue(c.before)}>
                          {summarizeValue(c.before)}
                        </div>
                        <div className={styles.valueCell} title={summarizeValue(c.after)}>
                          {summarizeValue(c.after)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              rawFallbackBlock()
            )}
          </>
        )}
      </Flex>
    </Dialog>
  );
};

export default AdminAuditDetailDialog;
