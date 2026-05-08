import React, { useEffect, useRef } from 'react';
import './CursorAnimation.css';

function CursorAnimation() {
  const cursorRef = useRef(null);
  const shadowRef = useRef(null);
  const rippleContainerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const shadow = shadowRef.current;
    let targetX = -300, targetY = -300;
    let currentX = -300, currentY = -300;

    // Smooth lagging follow (creates a "weighty" liquid feel)
    const animate = () => {
      currentX += (targetX - currentX) * 0.10;
      currentY += (targetY - currentY) * 0.10;
      if (cursor) {
        cursor.style.left = `${currentX}px`;
        cursor.style.top  = `${currentY}px`;
      }
      if (shadow) {
        shadow.style.left = `${currentX}px`;
        shadow.style.top  = `${currentY + 18}px`; // offset below the drop
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    // Water ripple on click
    const onClick = (e) => {
      const container = rippleContainerRef.current;
      if (!container) return;
      const ripple = document.createElement('div');
      ripple.className = 'water-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top  = `${e.clientY}px`;
      container.appendChild(ripple);
      ripple.addEventListener('animationend', () => {
        if (ripple.parentNode) ripple.remove();
      });
    };

    // Hover state on interactive elements
    const onEnter = () => {
      cursor?.classList.add('cursor-hover');
      shadow?.classList.add('shadow-hover');
    };
    const onLeave = () => {
      cursor?.classList.remove('cursor-hover');
      shadow?.classList.remove('shadow-hover');
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick);

    const updateInteractive = () => {
      const interactive = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label');
      interactive.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    updateInteractive();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      {/* Drop shadow beneath the sphere */}
      <div ref={shadowRef} className="water-cursor-shadow" />
      {/* The actual water drop sphere */}
      <div ref={cursorRef} className="water-cursor" />
      {/* Ripple rings container */}
      <div ref={rippleContainerRef} className="ripple-container" />
    </>
  );
}

export default CursorAnimation;
