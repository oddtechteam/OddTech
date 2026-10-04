"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

// Pointer position, normalised to -0.5…0.5 across an element.
export function usePointer() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };
  return { mx, my, onPointerMove };
}

// An absolutely-positioned layer that shifts with the pointer; bigger depth = moves more.
export default function ParallaxLayer({
  mx,
  my,
  depth,
  className,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  className: string;
  children: React.ReactNode;
}) {
  const x = useSpring(useTransform(mx, (v) => v * depth * 36), { stiffness: 90, damping: 18 });
  const y = useSpring(useTransform(my, (v) => v * depth * 36), { stiffness: 90, damping: 18 });
  return (
    <motion.div className={`absolute ${className}`} style={{ x, y }}>
      {children}
    </motion.div>
  );
}
