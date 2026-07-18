"use client";

import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { useEffect, useState } from 'react';

export default function GlobalCanvas() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 1 }}>
      <Canvas eventSource={document.body} className="global-canvas" style={{ pointerEvents: 'none' }}>
        <View.Port />
      </Canvas>
    </div>
  );
}
