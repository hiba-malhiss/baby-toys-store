import React, { useState } from 'react';
import { Button, Dialog, Flex, Text } from '@baby-toys/ui-kit';
import { GitBranch } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Opens a modal dialog showing the Product → Category / Attributes / Options → Variants
 * relationship diagram. All text is translated via i18n.
 */
const ProductRelationshipDiagram: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Resolve all translated strings before entering SVG (no JSX inside SVG text nodes)
  const label = {
    category: t('diagram.category', { defaultValue: 'Category' }),
    categoryHint: t('diagram.categoryHint', { defaultValue: 'e.g. Toys, Clothing' }),
    product: t('diagram.product', { defaultValue: 'Product' }),
    productHint: t('diagram.productHint', { defaultValue: 'name, price, images' }),
    attributes: t('diagram.attributes', { defaultValue: 'Attributes' }),
    attrHint: t('diagram.attributesHint', { defaultValue: 'Material, Brand…' }),
    attrNote: t('diagram.attributesNote', { defaultValue: 'for filtering & display' }),
    options: t('diagram.options', { defaultValue: 'Options' }),
    optHint: t('diagram.optionsHint', { defaultValue: 'Size (S, M, L)' }),
    optHint2: t('diagram.optionsHint2', { defaultValue: 'Color (Red, Blue)' }),
    variants: t('diagram.variants', { defaultValue: 'Variants' }),
    varHint: t('diagram.variantsHint', { defaultValue: 'S/Red: £12, 5 in stock' }),
    varNote: t('diagram.variantsNote', { defaultValue: 'own price, stock, image' }),
    has: t('diagram.arrowHas', { defaultValue: 'has' }),
    generate: t('diagram.arrowGenerate', { defaultValue: 'generate' }),
    step1: t('diagram.step1', { defaultValue: 'Step 1' }),
    step1L: t('diagram.step1Label', { defaultValue: 'Create categories' }),
    step2: t('diagram.step2', { defaultValue: 'Step 2' }),
    step2L: t('diagram.step2Label', { defaultValue: 'Add products & assign category' }),
    step3: t('diagram.step3', { defaultValue: 'Step 3' }),
    step3L: t('diagram.step3Label', { defaultValue: 'Add attributes & options to product' }),
    tipTitle: t('diagram.tipTitle', { defaultValue: '💡 Quick tip' }),
    tipLine1: t('diagram.tipLine1', {
      defaultValue: 'Set up Attribute Types and Option Types first',
    }),
    tipLine2: t('diagram.tipLine2', {
      defaultValue: '(in the sidebar menus) before creating products.',
    }),
  };

  return (
    <>
      <Button
        appearance="outline"
        size="small"
        leftIconComp={GitBranch}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        type="button"
      >
        {t('diagram.button', { defaultValue: 'How it works' })}
      </Button>

      <Dialog
        visible={open}
        onClose={() => setOpen(false)}
        header={t('diagram.title', { defaultValue: 'Product Data Model' })}
        size="large"
      >
        <Flex direction="vertical" spacing="l" fullWidth>
          <Text color="muted" size="sm">
            {t('diagram.description', {
              defaultValue:
                'This diagram shows how Categories, Products, Attributes, Options, and Variants relate to each other.',
            })}
          </Text>

          <svg
            viewBox="0 0 700 410"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', fontFamily: 'inherit' }}
            aria-label={t('diagram.title', { defaultValue: 'Product relationship diagram' })}
          >
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--color-text-muted,#9ca3af)" />
              </marker>
            </defs>

            {/* Background */}
            <rect width="700" height="410" rx="12" fill="var(--color-bg-secondary,#f8fafc)" />

            {/* ── CATEGORY box  x=20 y=150 w=130 h=58 ── */}
            <rect
              x="20"
              y="150"
              width="130"
              height="58"
              rx="8"
              fill="var(--color-primary-light,#e6f7fb)"
              stroke="var(--color-primary,#1096b5)"
              strokeWidth="1.5"
            />
            <text
              x="85"
              y="174"
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="var(--color-primary-dark,#0f83b2)"
            >
              {label.category}
            </text>
            <text
              x="85"
              y="192"
              textAnchor="middle"
              fontSize="10"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.categoryHint}
            </text>

            {/* Arrow Category → Product */}
            <line
              x1="150"
              y1="179"
              x2="208"
              y2="179"
              stroke="var(--color-text-muted,#9ca3af)"
              strokeWidth="1.5"
              markerEnd="url(#arr)"
            />
            <text
              x="179"
              y="172"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted,#9ca3af)"
            >
              {label.has}
            </text>

            {/* ── PRODUCT box  x=208 y=150 w=140 h=58 ── */}
            <rect
              x="208"
              y="150"
              width="140"
              height="58"
              rx="8"
              fill="var(--color-accent-light,#f8e6e5)"
              stroke="var(--color-accent,#f26c62)"
              strokeWidth="1.5"
            />
            <text
              x="278"
              y="174"
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="var(--color-accent-dark,#c54a42)"
            >
              {label.product}
            </text>
            <text
              x="278"
              y="192"
              textAnchor="middle"
              fontSize="10"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.productHint}
            </text>

            {/* Arrow Product → Attributes */}
            <line
              x1="348"
              y1="168"
              x2="420"
              y2="108"
              stroke="var(--color-text-muted,#9ca3af)"
              strokeWidth="1.5"
              markerEnd="url(#arr)"
            />
            <text
              x="390"
              y="132"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted,#9ca3af)"
            >
              {label.has}
            </text>

            {/* Arrow Product → Options */}
            <line
              x1="348"
              y1="190"
              x2="420"
              y2="210"
              stroke="var(--color-text-muted,#9ca3af)"
              strokeWidth="1.5"
              markerEnd="url(#arr)"
            />
            <text
              x="390"
              y="192"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted,#9ca3af)"
            >
              {label.has}
            </text>

            {/* ── ATTRIBUTES box  x=420 y=55 w=160 h=72 ── */}
            <rect
              x="420"
              y="55"
              width="160"
              height="72"
              rx="8"
              fill="var(--color-bg-success,#f4fff5)"
              stroke="var(--color-success,#25bf0c)"
              strokeWidth="1.5"
            />
            <text
              x="500"
              y="80"
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="var(--color-success-dark,#1a8607)"
            >
              {label.attributes}
            </text>
            <text
              x="500"
              y="98"
              textAnchor="middle"
              fontSize="10"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.attrHint}
            </text>
            <text
              x="500"
              y="113"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.attrNote}
            </text>

            {/* ── OPTIONS box  x=420 y=170 w=160 h=72 ── */}
            <rect
              x="420"
              y="170"
              width="160"
              height="72"
              rx="8"
              fill="var(--color-bg-warning,#fffaf4)"
              stroke="var(--color-warning,#feb705)"
              strokeWidth="1.5"
            />
            <text
              x="500"
              y="196"
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="var(--color-warning-dark,#cc9204)"
            >
              {label.options}
            </text>
            <text
              x="500"
              y="214"
              textAnchor="middle"
              fontSize="10"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.optHint}
            </text>
            <text
              x="500"
              y="229"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.optHint2}
            </text>

            {/* Arrow Options → Variants */}
            <line
              x1="500"
              y1="242"
              x2="500"
              y2="292"
              stroke="var(--color-text-muted,#9ca3af)"
              strokeWidth="1.5"
              markerEnd="url(#arr)"
            />
            <text
              x="520"
              y="270"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted,#9ca3af)"
            >
              {label.generate}
            </text>

            {/* ── VARIANTS box  x=420 y=292 w=160 h=66 ── */}
            <rect
              x="420"
              y="292"
              width="160"
              height="66"
              rx="8"
              fill="var(--color-bg-info,#f4faff)"
              stroke="var(--color-info,#12aee0)"
              strokeWidth="1.5"
            />
            <text
              x="500"
              y="318"
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="var(--color-info-dark,#0d7ea3)"
            >
              {label.variants}
            </text>
            <text
              x="500"
              y="336"
              textAnchor="middle"
              fontSize="10"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.varHint}
            </text>
            <text
              x="500"
              y="350"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.varNote}
            </text>

            {/* ── Divider ── */}
            <line
              x1="20"
              y1="375"
              x2="600"
              y2="375"
              stroke="var(--color-border,#e5e7eb)"
              strokeWidth="1"
            />

            {/* ── Step labels ── */}
            <text
              x="85"
              y="390"
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="var(--color-text-secondary,#375259)"
            >
              {label.step1}
            </text>
            <text
              x="85"
              y="405"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.step1L}
            </text>

            <text
              x="278"
              y="390"
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="var(--color-text-secondary,#375259)"
            >
              {label.step2}
            </text>
            <text
              x="278"
              y="405"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.step2L}
            </text>

            <text
              x="500"
              y="390"
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="var(--color-text-secondary,#375259)"
            >
              {label.step3}
            </text>
            <text
              x="500"
              y="405"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted,#6b7280)"
            >
              {label.step3L}
            </text>
          </svg>

          {/* Tip box below SVG */}
          <div
            style={{
              background: 'var(--color-bg-tertiary,#eef2f7)',
              border: '1px solid var(--color-border,#e5e7eb)',
              borderRadius: 8,
              padding: '10px 14px',
            }}
          >
            <Text size="sm" weight="medium">
              {label.tipTitle}
            </Text>
            <Text size="xs" color="muted" style={{ marginTop: 4 }}>
              {label.tipLine1}
            </Text>
            <Text size="xs" color="muted">
              {label.tipLine2}
            </Text>
          </div>
        </Flex>
      </Dialog>
    </>
  );
};

export default ProductRelationshipDiagram;
