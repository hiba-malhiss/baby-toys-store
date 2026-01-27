import { ComponentType, useMemo } from 'react';
import clsx from 'clsx';
import { IconColor, IconSize } from './icon.constant';
import styles from './icon.module.scss';
import {
  ArrowLeftRight,
  ArrowUpDown,
  Box,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Facebook,
  Filter,
  Gift,
  Heart,
  Inbox,
  Info,
  LayoutGrid,
  LoaderCircle,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Package,
  PackageOpen,
  Pencil,
  Phone,
  Plus,
  RotateCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  StarHalf,
  Trash2,
  Truck,
  X,
} from 'lucide-react';

type LucideIconComponent = ComponentType<{
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
}>;

interface IconProps {
  icon?: LucideIconComponent | null;
  iconName?: string | null;
  size?: IconSize;
  color?: IconColor | string;
  isRotating?: boolean;
  isSpinning?: boolean;
  className?: string;
  badge?: string | number;
  title?: string;
  ariaLabel?: string;
}

const ICON_MAP: Record<string, LucideIconComponent> = {
  truck: Truck,
  'truck-fast': Truck,
  shipping: Truck,
  'shipping-fast': Truck,
  phone: Phone,
  'phone-alt': Phone,
  email: Mail,
  envelope: Mail,
  mail: Mail,
  map: MapPin,
  'map-marker': MapPin,
  'map-marker-alt': MapPin,
  box: Box,
  package: Package,
  'box-open': PackageOpen,
  'package-open': PackageOpen,
  heart: Heart,
  star: Star,
  'star-half-alt': StarHalf,
  'star-half': StarHalf,
  check: Check,
  'check-circle': CheckCircle,
  times: X,
  close: X,
  x: X,
  search: Search,
  filter: Filter,
  copy: Copy,
  trash: Trash2,
  'trash-alt': Trash2,
  plus: Plus,
  minus: Minus,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  sort: ArrowUpDown,
  'sort-up': ChevronUp,
  'sort-down': ChevronDown,
  cart: ShoppingCart,
  'cart-shopping': ShoppingCart,
  'cart-plus': ShoppingCart,
  refresh: RotateCw,
  'arrow-left-right': ArrowLeftRight,
  grid: LayoutGrid,
  th: LayoutGrid,
  bars: Menu,
  info: Info,
  'circle-info': Info,
  eye: Eye,
  'eye-slash': EyeOff,
  pen: Pencil,
  pencil: Pencil,
  spinner: LoaderCircle,
  loader: LoaderCircle,
  facebook: Facebook,
  'facebook-f': Facebook,
  whatsapp: MessageCircle,
  message: MessageCircle,
  inbox: Inbox,
  gift: Gift,
  'credit-card': CreditCard,
  creditcard: CreditCard,
  shield: ShieldCheck,
};

const resolveIconByName = (iconName?: string | null): LucideIconComponent | null => {
  if (!iconName) return null;

  const normalize = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');

  let key = normalize(iconName);

  if (!key) return null;

  if (key.startsWith('lucide:')) {
    key = key.substring('lucide:'.length);
  }

  if (ICON_MAP[key]) return ICON_MAP[key];

  if (key.startsWith('fa-')) {
    const faKey = key.substring(3);
    if (ICON_MAP[faKey]) return ICON_MAP[faKey];
  }

  return null;
};

const Icon = ({
  icon,
  iconName,
  size = IconSize.medium,
  color,
  isRotating = false,
  isSpinning = false,
  className,
  badge,
  title,
  ariaLabel,
}: IconProps) => {
  const LucideComp = useMemo(() => {
    if (icon) return icon;
    return resolveIconByName(iconName);
  }, [icon, iconName]);

  const iconClass = useMemo(
    () =>
      clsx(
        styles.icon,
        color && color !== 'inherit' ? styles[`icon--${color}Color`] : undefined,
        styles[`icon--${size}Size`],
        {
          [styles.isRotating]: isRotating || isSpinning,
        }
      ),
    [color, size, isRotating, isSpinning]
  );

  const a11yProps =
    ariaLabel || title
      ? { role: 'img', 'aria-label': ariaLabel ?? title }
      : ({ 'aria-hidden': true } as const);

  if (!LucideComp) {
    return null;
  }

  return (
    <span className={clsx(styles.iconWrapper, className)}>
      <span className={iconClass}>
        <LucideComp size="1em" {...a11yProps} />
      </span>

      {!!badge && <span className={styles.iconBadge}>{badge}</span>}
    </span>
  );
};

export default Icon;
