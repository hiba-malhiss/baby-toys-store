import React, { useState, useRef, useEffect, type CSSProperties } from 'react';
import { clamp, roundToStep, getPercentFromEvent } from './slider.utils.ts';
import styles from './slider.module.scss';
import clsx from 'clsx';

interface SliderProps {
  min?: number;
  max?: number;
  value?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  step?: number;
  range?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

const passiveFalseOptions: AddEventListenerOptions = { passive: false };

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  value: propValue,
  onChange,
  step = 1,
  range = false,
  orientation = 'horizontal',
  className = '',
  autoFocus = false,
  disabled = false,
}) => {
  const [value, setValue] = useState<number | [number, number]>(
    propValue !== undefined ? propValue : range ? [min, max] : min
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<number | null>(null);

  useEffect(() => {
    if (propValue !== undefined) {
      setValue((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(propValue)) return propValue;
        return prev;
      });
    }
  }, [propValue]);

  useEffect(() => {
    if (autoFocus && !disabled) {
      const firstHandle =
        trackRef.current?.querySelector<HTMLDivElement>('[data-handle-index="0"]');
      firstHandle?.focus();
    }
  }, [autoFocus, disabled]);

  const getPercent = (val: number): number => ((val - min) / (max - min)) * 100;

  const getValueFromPercent = (percent: number): number => {
    let val = (percent / 100) * (max - min) + min;
    val = roundToStep(val, step, min);
    return clamp(val, min, max);
  };

  const updateValue = (newVal: number, handleIndex?: number) => {
    if (disabled) return;

    if (range) {
      let [start, end] = (value as [number, number]) || [min, max];

      if (handleIndex === 0) {
        start = Math.min(newVal, end);
      } else if (handleIndex === 1) {
        end = Math.max(newVal, start);
      }

      const newRange: [number, number] = [start, end];
      setValue(newRange);
      onChange?.(newRange);
    } else {
      setValue(newVal);
      onChange?.(newVal);
    }
  };

  // Native event handlers for mouse/touch move

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingRef.current === null) return;
    e.preventDefault();
    const percent = getPercentFromEvent(e.clientX, e.clientY, orientation, trackRef);
    updateValue(getValueFromPercent(percent), draggingRef.current);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (draggingRef.current === null) return;
    if (e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    const percent = getPercentFromEvent(touch.clientX, touch.clientY, orientation, trackRef);
    updateValue(getValueFromPercent(percent), draggingRef.current);
  };

  const handleDragEnd = () => {
    draggingRef.current = null;
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchend', handleDragEnd);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('touchmove', handleTouchMove, passiveFalseOptions);
  };

  // React synthetic event handlers for drag start

  const handleDragStart =
    (index: number) => (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      draggingRef.current = index;

      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, passiveFalseOptions);
    };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const percent = getPercentFromEvent(e.clientX, e.clientY, orientation, trackRef);
    const clickedValue = getValueFromPercent(percent);

    if (range) {
      const [start, end] = value as [number, number];
      const distStart = Math.abs(clickedValue - start);
      const distEnd = Math.abs(clickedValue - end);
      if (distStart < distEnd) {
        updateValue(clickedValue, 0);
      } else {
        updateValue(clickedValue, 1);
      }
    } else {
      updateValue(clickedValue);
    }
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    const stepSize = step || 1;
    let newVal: number;

    const currentVal = range ? (value as [number, number])[index] : (value as number);

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newVal = clamp(currentVal - stepSize, min, max);
        updateValue(newVal, index);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newVal = clamp(currentVal + stepSize, min, max);
        updateValue(newVal, index);
        break;
      case 'Home':
        updateValue(min, index);
        break;
      case 'End':
        updateValue(max, index);
        break;
    }
  };

  const renderHandle = (index: number) => {
    const val = range ? (value as [number, number])[index] : (value as number);
    const percent = getPercent(val);
    const style: CSSProperties =
      orientation === 'horizontal'
        ? { left: `calc(${percent}% - 8px)` }
        : { bottom: `calc(${percent}% - 8px)` };

    return (
      <div
        key={index}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={val}
        aria-orientation={orientation}
        data-handle-index={index}
        style={style}
        className={clsx(styles.sliderHandle, disabled && styles.sliderHandleIsDisabled)}
        onMouseDown={handleDragStart(index)}
        onTouchStart={handleDragStart(index)}
        onKeyDown={handleKeyDown(index)}
        aria-disabled={disabled}
      >
        <div className={styles.sliderHandleLabel}>{val}</div>
      </div>
    );
  };

  // Calculate filled track range for rendering
  let startPercent = 0;
  let endPercent = 0;
  if (range) {
    startPercent = getPercent((value as [number, number])[0]);
    endPercent = getPercent((value as [number, number])[1]);
  } else {
    endPercent = getPercent(value as number);
  }
  const filledSize = endPercent - startPercent;

  return (
    <div
      className={clsx(
        styles.slider,
        orientation === 'vertical' && styles.sliderVertical,
        disabled && styles.sliderIsDisabled,
        className
      )}
      onClick={handleTrackClick}
      ref={trackRef}
      aria-disabled={disabled}
    >
      <div
        className={clsx(
          styles.sliderTrack,
          orientation === 'vertical' && styles.sliderTrackVertical,
          disabled && styles.sliderTrackIsDisabled
        )}
      >
        <div
          className={clsx(
            styles.sliderFilledTrack,
            orientation === 'vertical'
              ? styles.sliderFilledTrackVertical
              : styles.sliderFilledTrackHorizontal,
            disabled && styles.sliderFilledTrackIsDisabled
          )}
          style={
            orientation === 'horizontal'
              ? { left: `${startPercent}%`, width: `${filledSize}%` }
              : { bottom: `${startPercent}%`, height: `${filledSize}%` }
          }
        />
      </div>

      <div className={styles.sliderMinMaxLabel}>
        <span>{min}</span>
        <span>{max}</span>
      </div>

      {!range && renderHandle(0)}
      {range && (
        <>
          {renderHandle(0)}
          {renderHandle(1)}
        </>
      )}
    </div>
  );
};

export default Slider;
