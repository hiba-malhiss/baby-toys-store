import React, { useState, useRef, useEffect } from 'react';
import styles from './color-picker.module.scss';
import { Popover } from '../index.ts';

type HSV = { h: number; s: number; v: number };

type Props = {
  value: string; // hex code, e.g. "#FF00AA"
  onChange: (hex: string) => void;
  inline?: boolean;
  readOnly?: boolean; // new prop
};

const hexToHSV = (hex: string): HSV => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (d !== 0) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return { h, s, v };
};

const hsvToHex = ({ h, s, v }: HSV): string => {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    const val = v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return Math.round(val * 255);
  };
  const r = f(5),
    g = f(3),
    b = f(1);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
};

export default function ColorPicker({ value, onChange, inline = false, readOnly = false }: Props) {
  const initialHSV = hexToHSV(value);
  const [hsv, setHSV] = useState<HSV>(initialHSV);
  const [showPanel, setShowPanel] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateColor = (newHSV: HSV) => {
    setHSV(newHSV);
    onChange(hsvToHex(newHSV));
  };

  const handleColorSelect = (e: React.MouseEvent) => {
    if (readOnly) return; // prevent interaction
    const rect = selectorRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = Math.max(0, Math.min(x / rect.width, 1));
    const v = 1 - Math.max(0, Math.min(y / rect.height, 1));
    updateColor({ ...hsv, s, v });
  };

  const handleHueSelect = (e: React.MouseEvent) => {
    if (readOnly) return; // prevent interaction
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const h = Math.max(0, Math.min((x / rect.width) * 360, 360));
    updateColor({ ...hsv, h });
  };

  useEffect(() => {
    setHSV(hexToHSV(value));
  }, [value]);

  return (
    <div className={styles.colorPicker}>
      {!inline && (
        <div
          ref={previewRef}
          className={styles.colorPickerPreview}
          style={{ backgroundColor: value, cursor: readOnly ? 'not-allowed' : 'pointer' }}
          onClick={() => !readOnly && setShowPanel(!showPanel)}
        />
      )}
      {!inline && (
        <Popover
          targetRef={previewRef}
          open={showPanel}
          onClose={() => setShowPanel(false)}
          position="bottom"
          dismissible={true}
          size="medium"
          gap={8}
        >
          <div
            ref={selectorRef}
            className={styles.colorPickerSelector}
            onClick={handleColorSelect}
            style={{
              backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
              cursor: readOnly ? 'not-allowed' : 'crosshair',
            }}
          >
            <div
              className={styles.colorPickerHandle}
              style={{
                left: `${hsv.s * 100}%`,
                top: `${(1 - hsv.v) * 100}%`,
              }}
            />
          </div>
          <div
            ref={hueRef}
            className={styles.colorPickerHueSlider}
            onClick={handleHueSelect}
            style={{ cursor: readOnly ? 'not-allowed' : 'pointer' }}
          >
            <div
              className={styles.colorPickerHueHandle}
              style={{ left: `${(hsv.h / 360) * 100}%` }}
            />
          </div>
        </Popover>
      )}
      {inline && (
        <div className={styles.colorPickerPanel}>
          <div
            ref={selectorRef}
            className={styles.colorPickerSelector}
            onClick={handleColorSelect}
            style={{
              backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
              cursor: readOnly ? 'not-allowed' : 'crosshair',
            }}
          >
            <div
              className={styles.colorPickerHandle}
              style={{
                left: `${hsv.s * 100}%`,
                top: `${(1 - hsv.v) * 100}%`,
              }}
            />
          </div>
          <div
            ref={hueRef}
            className={styles.colorPickerHueSlider}
            onClick={handleHueSelect}
            style={{ cursor: readOnly ? 'not-allowed' : 'pointer' }}
          >
            <div
              className={styles.colorPickerHueHandle}
              style={{ left: `${(hsv.h / 360) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
