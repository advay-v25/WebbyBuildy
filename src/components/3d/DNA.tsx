"use client";

import { useRef, useMemo, useEffect, RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, AdditiveBlending } from 'three';

const PARTICLE_COUNT = 6000; // Massively increased for a continuous ribbon feel
const RADIUS = 1.5;
const HEIGHT = 40;

export default function DNA({ scrollRef }: { scrollRef: RefObject<HTMLElement | null> }) {
  const meshRef = useRef<InstancedMesh>(null);
  
  const dummy = useMemo(() => new Object3D(), []);
  const colors = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
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
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      const angle = t * Math.PI * 15; // 7.5 full turns
      const y = (t - 0.5) * HEIGHT;
      
      // Interpolate color from top to bottom
      colorObj.lerpColors(colorRed, colorPurple, t);
      
      // 10% rungs, 90% strands
      const isRung = Math.random() > 0.9;
      
      if (isRung) {
        const strandOffset = Math.random();
        temp.push({ 
          angle, 
          y, 
          strandOffset,
          isRung: true,
          baseColor: colorObj.clone()
        });
        // Darker/less saturated rungs
        const rungColor = colorObj.clone().multiplyScalar(0.7);
        rungColor.toArray(colors, i * 3);
      } else {
        const isFirstStrand = i % 2 === 0;
        temp.push({ 
          angle: isFirstStrand ? angle : angle + Math.PI, 
          y, 
          strandOffset: isFirstStrand ? 0 : 1,
          isRung: false,
          baseColor: colorObj.clone()
        });
        
        colorObj.toArray(colors, i * 3);
      }
    }
    return temp;
  }, [colors]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const scrollOffset = scrollY.current * 0.005;
    
    const maxScroll = typeof window !== 'undefined' ? document.body.scrollHeight - window.innerHeight : 2000;
    const scrollProgress = typeof window !== 'undefined' ? scrollY.current / maxScroll : 0;
    const dissolveFactor = Math.pow(Math.max(0, scrollProgress - 0.7) * 3.33, 2); 
    
    meshRef.current.position.y = scrollOffset * 0.8; 
    meshRef.current.rotation.y = time * 0.15 + scrollOffset * 0.3; 
    
    particles.forEach((particle, i) => {
      let x, z;
      
      if (particle.isRung) {
        const angle1 = particle.angle;
        const angle2 = particle.angle + Math.PI;
        
        const x1 = Math.cos(angle1) * RADIUS;
        const z1 = Math.sin(angle1) * RADIUS;
        const x2 = Math.cos(angle2) * RADIUS;
        const z2 = Math.sin(angle2) * RADIUS;
        
        x = x1 + (x2 - x1) * particle.strandOffset;
        z = z1 + (z2 - z1) * particle.strandOffset;
      } else {
        // Strand thickness jitter to make it look like a tube
        const jitterX = (Math.random() - 0.5) * 0.15;
        const jitterZ = (Math.random() - 0.5) * 0.15;
        x = Math.cos(particle.angle) * RADIUS + jitterX;
        z = Math.sin(particle.angle) * RADIUS + jitterZ;
      }
      
      const yOffset = Math.sin(time * 0.5 + particle.y) * 0.3;
      
      const dispersionX = dissolveFactor > 0 ? (Math.random() - 0.5) * 15 * dissolveFactor : 0;
      const dispersionY = dissolveFactor > 0 ? (Math.random() - 0.5) * 15 * dissolveFactor : 0;
      const dispersionZ = dissolveFactor > 0 ? (Math.random() - 0.5) * 15 * dissolveFactor : 0;
      
      dummy.position.set(x + dispersionX, particle.y + yOffset + dispersionY, z + dispersionZ);
      
      // Far strand is slightly smaller for depth-of-field illusion
      // Global Z depends on the group rotation, but local Z works ok for a subtle effect
      const zScale = Math.max(0.5, (z + RADIUS) / (RADIUS * 2)); 
      let baseScale = particle.isRung ? 0.3 : (0.8 + zScale * 0.4);
      
      const scale = Math.max(0.01, baseScale * (1 - dissolveFactor));
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[4, 0, -5]} rotation={[0.2, 0, 0.1]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial 
          vertexColors 
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </instancedMesh>
    </group>
  );
}
