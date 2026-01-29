import React, { useCallback, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import Accordion from '../Accordion/Accordion';
import AccordionGroup from '../Accordion/AccordionGroup';
import Button from '../Button/Button';
import Flex from '../Flex/Flex';
import Tooltip from '../Tooltip/Tooltip';
import Icon from '../Icon/Icon';
import type { MenuItem } from '../Menu/Menu';
import styles from './aside.module.scss';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type AsideProps = {
  model: MenuItem[];
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  footerExpanded?: React.ReactNode;
  footerCollapsed?: React.ReactNode;
  defaultExpanded?: boolean;
  autoOverflow?: boolean;
};

const Aside: React.FC<AsideProps> = ({
  model,
  className,
  header,
  footer,
  footerExpanded,
  footerCollapsed,
  defaultExpanded = true,
  autoOverflow = true,
}) => {
  const [isLockedOpen, setIsLockedOpen] = useState(defaultExpanded);
  const [isHovering, setIsHovering] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverTimer = useRef<number | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  /**
   * ✅ Enable hover behavior ONLY on devices that truly support hover
   * (mouse / trackpad). Touch screens will never trigger expand-on-hover.
   */
  const canHover = useMemo(() => {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  }, []);

  const isExpanded = isLockedOpen || (canHover && isHovering);

  const toggleLock = useCallback(() => {
    setIsLockedOpen((v) => !v);
  }, []);

  const setHovering = useCallback((val: boolean, delay = 0) => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }

    if (delay > 0) {
      hoverTimer.current = window.setTimeout(() => {
        setIsHovering(val);
        hoverTimer.current = null;
      }, delay);
    } else {
      setIsHovering(val);
    }
  }, []);

  const handleItemClick = useCallback(
    (item: MenuItem) => () => {
      if (item.route) navigate(item.route);
      else item.command?.();
    },
    [navigate]
  );

  const isRouteInSubtree = useCallback(
    (items: MenuItem[] = []): boolean =>
      items.some((item) =>
        item.route === location.pathname ? true : item.items ? isRouteInSubtree(item.items) : false
      ),
    [location.pathname]
  );

  const content = useMemo(() => {
    const renderCollapsed = (items: MenuItem[]) =>
      items.map((item, idx) => {
        const hasSubmenu = Array.isArray(item.items) && item.items.length > 0;
        const isSelected = hasSubmenu
          ? isRouteInSubtree(item.items ?? [])
          : item.route === location.pathname;

        return (
          <Tooltip key={idx} content={item.label} position="right">
            <Button
              appearance="link"
              color="secondary-light"
              fullWidth
              align="center"
              leftIconComp={item.iconComp}
              size="large"
              onClick={hasSubmenu ? () => setIsLockedOpen(true) : handleItemClick(item)}
              isDisabled={item.disabled}
              isSelected={isSelected}
              aria-label={item.label}
            />
          </Tooltip>
        );
      });

    const renderExpanded = (items: MenuItem[]) => (
      <AccordionGroup allowMultipleOpen fullWidth unstyled autoOverflow={autoOverflow}>
        <Flex direction="vertical" fullWidth>
          {items.map((item, idx) => {
            const hasSubmenu = Array.isArray(item.items) && item.items.length > 0;
            const isSelected = item.route === location.pathname;

            if (hasSubmenu) {
              const defaultOpen = isRouteInSubtree(item.items ?? []);

              return (
                <Accordion
                  key={idx}
                  header={
                    <Flex align="center" fullWidth spacing="s">
                      {item.iconComp && (
                        <Icon
                          icon={item.iconComp}
                          color={defaultOpen ? undefined : 'secondary'}
                          size="large"
                        />
                      )}
                      <span>{item.label}</span>
                    </Flex>
                  }
                  disabled={item.disabled}
                  withoutPadding
                  buttonColor="secondary-light"
                  buttonAppearance="link"
                  unstyled
                  defaultOpen={defaultOpen}
                >
                  <div>
                    {(item.items ?? []).map((sub, sidx) => (
                      <Button
                        key={sidx}
                        appearance="link"
                        color="secondary-light"
                        onClick={handleItemClick(sub)}
                        isDisabled={sub.disabled}
                        fullWidth
                        align="start"
                        size="large"
                        className="bts-paddingLxl"
                        isSelected={sub.route === location.pathname}
                      >
                        {sub.label}
                      </Button>
                    ))}
                  </div>
                </Accordion>
              );
            }

            return (
              <Button
                key={idx}
                color="secondary-light"
                onClick={handleItemClick(item)}
                isDisabled={item.disabled}
                leftIconComp={item.iconComp}
                size="large"
                fullWidth
                appearance="link"
                align="start"
                isSelected={isSelected}
              >
                {item.label}
              </Button>
            );
          })}
        </Flex>
      </AccordionGroup>
    );

    return { renderCollapsed, renderExpanded };
  }, [autoOverflow, handleItemClick, isRouteInSubtree, location.pathname]);

  return (
    <div
      ref={containerRef}
      className={clsx(styles.asideContainer, { [styles.expanded]: isExpanded }, className)}
    >
      <div
        className={styles.content}
        onPointerEnter={() => canHover && setHovering(true)}
        onPointerLeave={() => canHover && setHovering(false, 80)}
        onPointerDown={() => {
          if (!canHover) return;
          if (!isLockedOpen) setHovering(true);
        }}
        onPointerUp={() => {
          if (!canHover) return;
          if (!isLockedOpen) setHovering(false, 80);
        }}
      >
        <div className={styles.header}>{isExpanded ? header : null}</div>

        <nav className={styles.nav}>
          {isExpanded ? content.renderExpanded(model) : content.renderCollapsed(model)}
        </nav>

        <div className={styles.footer}>
          {isExpanded ? (footerExpanded ?? footer) : (footerCollapsed ?? footer)}
        </div>
      </div>

      <Tooltip content={isLockedOpen ? 'Close sidebar' : 'Open sidebar'} position="right">
        <button
          type="button"
          aria-label={isLockedOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className={styles.toggle}
          onClick={toggleLock}
        >
          <span className={styles.sidebarTool} aria-hidden />
          <span className={styles.toggleIcon} aria-hidden>
            <Icon
              icon={isLockedOpen ? ChevronLeft : ChevronRight}
              color="secondary"
              size="xlarge"
            />
          </span>
        </button>
      </Tooltip>
    </div>
  );
};

export default Aside;
