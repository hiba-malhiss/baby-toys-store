import {
  faChevronCircleDown,
  faChevronCircleLeft,
  faChevronCircleRight,
  faChevronCircleUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

export const ChevronIcons = {
  overlay: {
    horizontal: {
      prev: faChevronCircleLeft,
      next: faChevronCircleRight,
    },
    vertical: {
      prev: faChevronCircleUp,
      next: faChevronCircleDown,
    },
  },
  side: {
    horizontal: {
      prev: faChevronLeft,
      next: faChevronRight,
    },
    vertical: {
      prev: faChevronUp,
      next: faChevronDown,
    },
  },
};
