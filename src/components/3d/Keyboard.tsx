"use client";

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Vector3 } from 'three';
import { PerspectiveCamera, RoundedBox, Text } from '@react-three/drei';

export default function Keyboard({ isSpacePressed, transitioning }: { isSpacePressed: boolean, transitioning: boolean }) {
  const group = useRef<Group>(null);
  const keysGroup = useRef<Group>(null);
  const spacebarRef = useRef<any>(null);
  
  const rippleRef = useRef({ time: 0, x: 0, z: 0, active: false });
  
  useEffect(() => {
    // Trigger random ripples occasionally
    const interval = setInterval(() => {
      rippleRef.current = {
        time: performance.now(),
        x: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 6,
        active: true
      };
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const keys = useMemo(() => {
    const layout = [
      { count: 14, widths: [], legends: ['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'DEL'] },
      { count: 14, widths: [1.5, ...Array(12).fill(1), 1.5], legends: ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACK'] },
      { count: 14, widths: [1.8, ...Array(12).fill(1), 1.2], legends: ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'] },
      { count: 13, widths: [2.0, ...Array(11).fill(1), 2.0], legends: ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'] },
      { count: 12, widths: [2.5, ...Array(10).fill(1), 2.5], legends: ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT'] },
      { count: 7, widths: [1.5, 1.25, 1.25, 6.0, 1.25, 1.25, 1.5], legends: ['CTRL', 'WIN', 'ALT', '', 'ALT', 'FN', 'CTRL'] }
    ];
    
    type KeyObject = { position: [number, number, number]; width: number; isSpacebar: boolean; id: string; legend: string; x: number; z: number };
    const keyObjects: KeyObject[] = [];
    let zOffset = -3.5;

    layout.forEach((row, rowIndex) => {
      let xOffset = -7.5;
      const numKeys = row.widths.length > 0 ? row.widths.length : row.count;
      
      for (let i = 0; i < numKeys; i++) {
        const width = row.widths.length > 0 ? row.widths[i] : 1;
        const isSpacebar = rowIndex === 5 && i === 3;
        const legend = row.legends[i] || '';
        
        const xPos = xOffset + width / 2;
        keyObjects.push({
          position: [xPos, 0.4, zOffset],
          width: width - 0.15, // Gap between keys
          isSpacebar,
          id: `${rowIndex}-${i}`,
          legend,
          x: xPos,
          z: zOffset
        });
        
        xOffset += width;
      }
      zOffset += 1.2;
    });
    
    return keyObjects;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (group.current) {
      if (transitioning) {
        // Transition animation is handled largely by CSS now. 
        // We just stabilize the 3D rotation gently so it doesn't spin wildly while sinking.
        group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, 0.4, 0.05);
        group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, 0, 0.05);
      } else {
        // Subtle Idle float
        group.current.position.y = Math.sin(t * 1.5) * 0.08;
        
        // Soft cursor parallax (max ~6 degrees)
        const targetRotationX = 0.4 + (state.pointer.y * Math.PI) / 30;
        const targetRotationY = (state.pointer.x * Math.PI) / 30;
        
        group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
        group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.05);
      }
    }

    if (spacebarRef.current) {
      // Travel down 70% of depth (depth is 0.5, so 0.35 travel)
      const targetY = isSpacePressed ? 0.05 : 0.4;
      spacebarRef.current.position.y = MathUtils.lerp(spacebarRef.current.position.y, targetY, 0.2);
    }
  });

  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[0, 9, 12]} 
        fov={45} 
      />
      <group ref={group} rotation={[0.4, 0, 0]}>
        {/* Keyboard Base Case */}
        <RoundedBox args={[16.8, 0.5, 7.8]} radius={0.15} smoothness={4} position={[0, -0.15, -0.5]}>
          <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
        </RoundedBox>
        
        {/* Emissive Backlight Plane (Red light shines through gaps) */}
        <mesh position={[0, 0.12, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[16.2, 7.2]} />
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#E63946" 
            emissiveIntensity={isSpacePressed ? 4 : 2} 
          />
        </mesh>

        {/* Keys */}
        <group ref={keysGroup}>
          {keys.map((k) => {
            const isSpace = k.isSpacebar;
            return (
              <group 
                key={k.id} 
                position={[k.position[0] - 7.5, k.position[1], k.position[2]]}
                ref={isSpace ? spacebarRef : undefined}
              >
                <RoundedBox args={[k.width, 0.5, 1.05]} radius={0.06} smoothness={2}>
                  <meshStandardMaterial 
                    color="#050505" 
                    roughness={0.7} 
                    metalness={0.2}
                  />
                </RoundedBox>
                
                {k.legend && (
                  <Text 
                    position={[0, 0.26, 0]} 
                    rotation={[-Math.PI / 2, 0, 0]} 
                    fontSize={k.legend.length > 1 ? 0.2 : 0.25} 
                    color="#FFFFFF"
                    anchorX="center"
                    anchorY="middle"
                    material-opacity={0.8}
                    material-transparent={true}
                  >
                    {k.legend}
                  </Text>
                )}
                
                {isSpace && (
                  <mesh position={[0, -0.2, 0]}>
                    <boxGeometry args={[k.width + 0.05, 0.1, 1.1]} />
                    <meshStandardMaterial 
                      color="#ff0000"
                      emissive="#E63946" 
                      emissiveIntensity={isSpacePressed ? 5 : 2}
                    />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>
      </group>

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" />
      <spotLight position={[0, 15, -5]} intensity={2.5} color="#ffffff" penumbra={1} angle={0.6} />
    </>
  );
}
