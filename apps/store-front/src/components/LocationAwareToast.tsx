import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@baby-toys/ui-kit';

const LocationAwareToast: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const toast = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Show toast only if location state has showToast and hasn't been shown yet
    if (location.state?.showToast && !hasShownToast.current) {
      const { toastMessage, toastType = 'success' } = location.state;
      toast[toastType](toastMessage);
      hasShownToast.current = true;

      // Replace history state so the toast is not shown again
      const newState = { ...location.state, showToast: false };
      window.history.replaceState(newState, document.title);
    }
  }, [location, toast]);

  return <>{children}</>;
};

export default LocationAwareToast;
