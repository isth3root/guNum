import React, { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface SwipeableProps {
  children: React.ReactNode;
}

const Swipeable: React.FC<SwipeableProps> = ({ children }) => {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const elementRef = useRef<HTMLDivElement>(null);

  const bind = useDrag(
    (state) => {
      const { offset: [dragX, dragY] } = state;
      const element = elementRef.current;

      if (!element) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;

      const constrainedX = Math.max(
        0,
        Math.min(viewportWidth - elementWidth, dragX)
      );
      const constrainedY = Math.max(
        0,
        Math.min(viewportHeight - elementHeight, dragY)
      );

      api.start({ x: constrainedX, y: constrainedY });
    },
    {
      bounds: () => {
        const element = elementRef.current;
        if (!element) return { left: 0, right: 0, top: 0, bottom: 0 };

        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;

        return {
          left: 0,
          right: window.innerWidth - elementWidth,
          top: 0,
          bottom: window.innerHeight - elementHeight,
        };
      },
      rubberband: true,
      threshold: 0,
      pointer: { touch: true, mouse: true },
      onDragStart: () => {
        document.body.style.overflow = 'hidden'; // Prevent page scroll
      },
      onDragEnd: () => {
        document.body.style.overflow = ''; // Re-enable page scroll
      },
    }
  );

  useEffect(() => {
    const handleScroll = (event: Event) => {
      event.preventDefault(); // Prevent page scrolling while dragging
    };

    document.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <animated.div
      ref={elementRef}
      {...bind()}
      style={{
        x,
        y,
        touchAction: 'none',
      }}
    >
      {children}
    </animated.div>
  );
};

export default Swipeable;
