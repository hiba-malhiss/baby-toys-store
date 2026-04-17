import React, { useState } from 'react';
import { Button, Dialog, Flex, Text } from '@baby-toys/ui-kit';
import { GitBranch } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * A button that opens a modal with an SVG diagram showing the relationship
 * between Categories, Products, Attributes, Options, and Variants.
 * Designed to help admins understand the data model before setting things up.
 */
const ProductRelationshipDiagram: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button
        appearance="outline"
        size="small"
        leftIconComp={GitBranch}
        onClick={() => setOpen(true)}
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
            viewBox="0 0 720 420"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', fontFamily: 'inherit' }}
            aria-label="Product relationship diagram"
          >
            {/* ── Definitions ── */}
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-text-muted, #9ca3af)" />
              </marker>
            </defs>

            {/* ── Background ── */}
            <rect width="720" height="420" rx="12" fill="var(--color-bg-secondary, #f8fafc)" />

            {/* ── CATEGORY box ── */}
            <rect x="30" y="160" width="130" height="60" rx="8"
              fill="var(--color-primary-light, #e6f7fb)"
              stroke="var(--color-primary, #1096b5)" strokeWidth="1.5" />
            <text x="95" y="186" textAnchor="middle" fontSize="13" fontWeight="600"
              fill="var(--color-primary-dark, #0f83b2)">Category</text>
            <text x="95" y="204" textAnchor="middle" fontSize="11"
              fill="var(--color-text-muted, #6b7280)">e.g. Toys, Clothing</text>

            {/* ── PRODUCT box ── */}
            <rect x="230" y="160" width="140" height="60" rx="8"
              fill="var(--color-accent-light, #f8e6e5)"
              stroke="var(--color-accent, #f26c62)" strokeWidth="1.5" />
            <text x="300" y="186" textAnchor="middle" fontSize="13" fontWeight="600"
              fill="var(--color-accent-dark, #c54a42)">Product</text>
            <text x="300" y="204" textAnchor="middle" fontSize="11"
              fill="var(--color-text-muted, #6b7280)">name, price, images</text>

            {/* ── ATTRIBUTES box ── */}
            <rect x="450" y="60" width="150" height="70" rx="8"
              fill="var(--color-bg-success, #f4fff5)"
              stroke="var(--color-success, #25bf0c)" strokeWidth="1.5" />
            <text x="525" y="88" textAnchor="middle" fontSize="13" fontWeight="600"
              fill="var(--color-success-dark, #1a8607)">Attributes</text>
            <text x="525" y="106" textAnchor="middle" fontSize="11"
              fill="var(--color-text-muted, #6b7280)">Material, Brand…</text>
            <text x="525" y="120" textAnchor="middle" fontSize="10"
              fill="var(--color-text-muted, #6b7280)">for filtering &amp; display</text>

            {/* ── OPTIONS box ── */}
            <rect x="450" y="175" width="150" height="70" rx="8"
              fill="var(--color-bg-warning, #fffaf4)"
              stroke="var(--color-warning, #feb705)" strokeWidth="1.5" />
            <text x="525" y="203" textAnchor="middle" fontSize="13" fontWeight="600"
              fill="var(--color-warning-dark, #cc9204)">Options</text>
            <text x="525" y="221" textAnchor="middle" fontSize="11"
              fill="var(--color-text-muted, #6b7280)">Size (S, M, L)</text>
            <text x="525" y="235" textAnchor="middle" fontSize="10"
              fill="var(--color-text-muted, #6b7280)">Color (Red, Blue)</text>

            {/* ── VARIANTS box ── */}
            <rect x="450" y="300" width="150" height="70" rx="8"
              fill="var(--color-bg-info, #f4faff)"
              stroke="var(--color-info, #12aee0)" strokeWidth="1.5" />
            <text x="525" y="328" textAnchor="middle" fontSize="13" fontWeight="600"
              fill="var(--color-info-dark, #0d7ea3)">Variants</text>
            <text x="525" y="346" textAnchor="middle" fontSize="11"
              fill="var(--color-text-muted, #6b7280)">S/Red: £12, 5 in stock</text>
            <text x="525" y="360" textAnchor="middle" fontSize="10"
              fill="var(--color-text-muted, #6b7280)">own price, stock, image</text>

            {/* ── Arrows ── */}
            {/* Category → Product */}
            <line x1="160" y1="190" x2="228" y2="190"
              stroke="var(--color-text-muted, #9ca3af)" strokeWidth="1.5"
              markerEnd="url(#arrow)" />
            <text x="194" y="183" textAnchor="middle" fontSize="10"
              fill="var(--color-text-muted, #9ca3af)">has</text>

            {/* Product → Attributes */}
            <line x1="370" y1="178" x2="448" y2="120"
              stroke="var(--color-text-muted, #9ca3af)" strokeWidth="1.5"
              markerEnd="url(#arrow)" />
            <text x="415" y="142" textAnchor="middle" fontSize="10"
              fill="var(--color-text-muted, #9ca3af)">has</text>

            {/* Product → Options */}
            <line x1="370" y1="190" x2="448" y2="205"
              stroke="var(--color-text-muted, #9ca3af)" strokeWidth="1.5"
              markerEnd="url(#arrow)" />
            <text x="415" y="192" textAnchor="middle" fontSize="10"
              fill="var(--color-text-muted, #9ca3af)">has</text>

            {/* Options → Variants */}
            <line x1="525" y1="245" x2="525" y2="298"
              stroke="var(--color-text-muted, #9ca3af)" strokeWidth="1.5"
              markerEnd="url(#arrow)" />
            <text x="546" y="275" textAnchor="middle" fontSize="10"
              fill="var(--color-text-muted, #9ca3af)">generate</text>

            {/* ── Step labels ── */}
            <rect x="30" y="260" width="570" height="1"
              fill="var(--color-border, #e5e7eb)" />

            <text x="95" y="285" textAnchor="middle" fontSize="11" fontWeight="600"
              fill="var(--color-text-secondary, #375259)">Step 1</text>
            <text x="95" y="300" textAnchor="middle" fontSize="10"
              fill="var(--color-text-muted, #6b7280)">Create categories</text>

            <text x="300" y="285" textAnchor="middle" fontSize="11" fontWeight="600"
              fill="var(--color-text-secondary, #375259)">Step 2</text>
            <text x="300" y="300" textAnchor="middle" fontSize="10"
              fill="var(--color-text-muted, #6b7280)">Add products &amp; assign category</text>

            <text x="525" y="285" textAnchor="middle" fontSize="11" fontWeight="600"
              fill="var(--color-text-secondary, #375259)">Step 3</text>
            <text x="525" y="300" textAnchor="middle" fontSize="10"
              fill="var(--color-text-muted, #6b7280)">Add attributes &amp; options to product</text>

            {/* Note box */}
            <rect x="30" y="330" width="380" height="66" rx="8"
              fill="var(--color-bg-tertiary, #eef2f7)"
              stroke="var(--color-border, #e5e7eb)" strokeWidth="1" />
            <text x="42" y="350" fontSize="11" fontWeight="600"
              fill="var(--color-text-secondary, #375259)">💡 Quick tip</text>
            <text x="42" y="368" fontSize="10"
              fill="var(--color-text-muted, #6b7280)">Set up Attribute Types and Option Types first</text>
            <text x="42" y="383" fontSize="10"
              fill="var(--color-text-muted, #6b7280)">(in the sidebar menus) before creating products.</text>
          </svg>
        </Flex>
      </Dialog>
    </>
  );
};

export default ProductRelationshipDiagram;
