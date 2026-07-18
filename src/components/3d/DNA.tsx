"use client";

import { useRef, useMemo, useEffect, RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, AdditiveBlending } from 'three';

const STRAND_PARTICLES = 3000;
const RUNGS_COUNT = 300;
const TOTAL_PARTICLES = STRAND_PARTICLES * 2 + RUNGS_COUNT * 10; // Rungs are 10 particles each
const RADIUS = 1.2;
const HEIGHT = 40;
const TURNS = 7.5; // full turns over the height

export default function DNA({ scrollRef }: { scrollRef: RefObject<HTMLElement | null> }) {
  const meshRef = useRef<InstancedMesh>(null);
  
  const dummy = useMemo(() => new Object3D(), []);
  const colors = useMemo(() => new Float32Array(TOTAL_PARTICLES * 3), []);
  const scrollY = useRef(0);
  
  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const particles = useMemo(() => {
    const temp = [];
    const colorObj = new Color();
    
    // Brand red to purple
    const colorRed = new Color('#E63946');
    const colorPurple = new Color('#8B5CF6');
    
    let particleIndex = 0;

    // Generate Strands
    for (let strand = 0; strand < 2; strand++) {
      const phase = strand * Math.PI;
      for (let i = 0; i < STRAND_PARTICLES; i++) {
        const t = i / STRAND_PARTICLES;
        const angle = t * Math.PI * 2 * TURNS + phase;
        const y = (t - 0.5) * HEIGHT;
        
        colorObj.lerpColors(colorRed, colorPurple, t);
        
        temp.push({ 
          x: Math.cos(angle) * RADIUS,
          y,
          z: Math.sin(angle) * RADIUS,
          scale: 1,
          isRung: false
        });
        
        colorObj.toArray(colors, particleIndex * 3);
        particleIndex++;
      }
    }

    // Generate Rungs
    for (let i = 0; i < RUNGS_COUNT; i++) {
      const t = i / RUNGS_COUNT;
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      
      const x1 = Math.cos(angle) * RADIUS;
      const z1 = Math.sin(angle) * RADIUS;
      const x2 = Math.cos(angle + Math.PI) * RADIUS;
      const z2 = Math.sin(angle + Math.PI) * RADIUS;

      colorObj.lerpColors(colorRed, colorPurple, t).multiplyScalar(0.7); // Darker rungs
      
      const dotsPerRung = 10;
      for (let j = 0; j < dotsPerRung; j++) {
        const f = j / (dotsPerRung - 1);
        temp.push({
          x: x1 + (x2 - x1) * f,
          y,
          z: z1 + (z2 - z1) * f,
          scale: 0.6,
          isRung: true
        });
        
        colorObj.toArray(colors, particleIndex * 3);
        particleIndex++;
      }
    }

    return temp;
  }, [colors]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const scrollOffset = scrollY.current * 0.005;
    
    meshRef.current.position.y = scrollOffset * 0.8; 
    meshRef.current.rotation.y = time * 0.15 + scrollOffset * 0.3; 
    
    // Optional dissolve effect before book section
    const maxScroll = typeof window !== 'undefined' ? document.body.scrollHeight - window.innerHeight : 2000;
    const scrollProgress = typeof window !== 'undefined' ? scrollY.current / maxScroll : 0;
    const dissolveFactor = Math.pow(Math.max(0, scrollProgress - 0.8) * 5, 2);
    
    particles.forEach((particle, i) => {
      // Fade out particles slightly when dissolving, no explosive dispersion
      const yOffset = Math.sin(time * 1.5 + particle.y * 2) * 0.05 * (particle.isRung ? 0 : 1);
      
      dummy.position.set(particle.x, particle.y + yOffset, particle.z);
      
      // Depth of field illusion
      const zScale = Math.max(0.6, (particle.z + RADIUS) / (RADIUS * 2)); 
      const baseScale = particle.scale * (particle.isRung ? 1 : zScale);
      
      const scale = Math.max(0.01, baseScale * (1 - dissolveFactor));
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[4, 0, -5]} rotation={[0.2, 0, 0.1]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, TOTAL_PARTICLES]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial 
          vertexColors 
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </instancedMesh>
    </group>
  );
}
