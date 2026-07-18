"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Vector3 } from 'three';
import { PerspectiveCamera } from '@react-three/drei';

export default function Keyboard({ isSpacePressed, transitioning }: { isSpacePressed: boolean, transitioning: boolean }) {
  const group = useRef<Group>(null);
  const cameraRef = useRef<any>(null);
  
  // A more complete TKL (Tenkeyless) keyboard layout approximation
  const keys = useMemo(() => {
    const layout = [
      { count: 14, widths: [] }, // Row 1: Function + Esc
      { count: 14, widths: [1.5, ...Array(12).fill(1), 1.5] }, // Row 2: Numbers
      { count: 14, widths: [1.8, ...Array(12).fill(1), 1.2] }, // Row 3: Tab/QWERTY
      { count: 13, widths: [2.0, ...Array(11).fill(1), 2.0] }, // Row 4: Caps/ASDF
      { count: 12, widths: [2.5, ...Array(10).fill(1), 2.5] }, // Row 5: Shift/ZXCV
      { count: 7, widths: [1.5, 1.25, 1.25, 6.0, 1.25, 1.25, 1.5] }  // Row 6: Spacebar row
    ];
    
    type KeyObject = { position: [number, number, number]; width: number; isSpacebar: boolean; id: string };
    const keyObjects: KeyObject[] = [];
    let zOffset = -3.5;

    layout.forEach((row, rowIndex) => {
      let xOffset = -7.5;
      
      const numKeys = row.widths.length > 0 ? row.widths.length : row.count;
      
      for (let i = 0; i < numKeys; i++) {
        const width = row.widths.length > 0 ? row.widths[i] : 1;
        const isSpacebar = rowIndex === 5 && i === 3;
        
        keyObjects.push({
          position: [xOffset + width / 2, 0.4, zOffset],
          width: width - 0.15, // Gap between keys
          isSpacebar,
          id: `${rowIndex}-${i}`
        });
        
        xOffset += width;
      }
      zOffset += 1.2;
    });
    
    return keyObjects;
  }, []);

  const spacebarWorldPos = useMemo(() => new Vector3(0, 0, 0), []);
  const targetCamPos = useMemo(() => new Vector3(0, 0.5, 2.8), []); // Roughly spacebar local pos + small offset

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (group.current) {
      if (transitioning) {
        // Zoom transition: Move camera sharply towards spacebar
        if (cameraRef.current) {
          // Accelerating ease towards the spacebar
          cameraRef.current.position.lerp(targetCamPos, 0.15);
          cameraRef.current.lookAt(0, 0.4, 2.5); // Look directly at spacebar
          cameraRef.current.updateProjectionMatrix();
        }
        
        // Stabilize group rotation
        group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, 0, 0.1);
        group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, 0, 0.1);
        group.current.position.y = MathUtils.lerp(group.current.position.y, 0, 0.1);
      } else {
        // Idle floating animation
        group.current.position.y = Math.sin(t * 1.5) * 0.15;
        
        // Cursor parallax
        const targetRotationX = MathUtils.lerp(group.current.rotation.x, (state.pointer.y * Math.PI) / 25 + 0.4, 0.1);
        const targetRotationY = MathUtils.lerp(group.current.rotation.y, (state.pointer.x * Math.PI) / 25, 0.1);
        
        group.current.rotation.x = targetRotationX;
        group.current.rotation.y = targetRotationY;
      }
    }
  });

  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        ref={cameraRef} 
        position={[0, 8, 12]} 
        fov={45} 
      />
      <group ref={group} rotation={[0.4, 0, 0]}>
        {/* Keyboard Base Case */}
        <mesh position={[0, -0.2, -0.5]}>
          <boxGeometry args={[16.5, 0.6, 7.5]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
        </mesh>
        
        {/* Emissive Backlight Plane (Red light shines through gaps) */}
        <mesh position={[0, 0.15, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[15.8, 6.8]} />
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#E63946" 
            emissiveIntensity={isSpacePressed ? 4 : 1.5} 
          />
        </mesh>

        {/* Keys */}
        {keys.map((k) => {
          // Give spacebar a slight pulse when idle
          const pulse = k.isSpacebar && !isSpacePressed ? Math.sin(Date.now() / 300) * 0.5 + 0.5 : 0;
          
          return (
            <mesh 
              key={k.id} 
              position={[
                k.position[0] - 7.5, // Center offset
                k.isSpacebar && isSpacePressed ? 0.2 : k.position[1], 
                k.position[2]
              ]}
            >
              {/* Keycap geometry with slight bevel illusion via material */}
              <boxGeometry args={[k.width, 0.5, 1.05]} />
              <meshStandardMaterial 
                color="#050505" // Very dark grey/black keycaps
                roughness={0.7} 
                metalness={0.2}
              />
              
              {/* If spacebar, add an extra emissive rim or glow effect */}
              {k.isSpacebar && (
                <mesh position={[0, -0.2, 0]}>
                   <boxGeometry args={[k.width + 0.05, 0.1, 1.1]} />
                   <meshStandardMaterial 
                    color="#ff0000"
                    emissive="#E63946" 
                    emissiveIntensity={isSpacePressed ? 5 : 2 + pulse}
                   />
                </mesh>
              )}
            </mesh>
          );
        })}
      </group>

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#ffffff" />
      {/* Top rim light to catch edges of black keycaps */}
      <spotLight position={[0, 15, -5]} intensity={2} color="#ffffff" penumbra={1} angle={0.6} />
    </>
  );
}
