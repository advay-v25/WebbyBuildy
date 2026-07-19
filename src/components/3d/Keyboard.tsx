"use client";

import { useRef, useMemo, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Vector3, Euler, Mesh, MeshPhysicalMaterial } from 'three';
import { PerspectiveCamera, RoundedBox, ContactShadows } from '@react-three/drei';

export default function Keyboard({ isSpacePressed, explodeProgress }: { isSpacePressed: boolean; explodeProgress?: MutableRefObject<number> }) {
  const group = useRef<Group>(null);
  const keysGroup = useRef<Group>(null);
  const baseRef = useRef<Group>(null);

  const keys = useMemo(() => {
    const layout = [
      { count: 14, widths: [], legends: ['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'DEL'] },
      { count: 14, widths: [1.5, ...Array(12).fill(1), 1.5], legends: ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACK'] },
      { count: 14, widths: [1.8, ...Array(12).fill(1), 1.2], legends: ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'] },
      { count: 13, widths: [2.0, ...Array(11).fill(1), 2.0], legends: ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'] },
      { count: 12, widths: [2.5, ...Array(10).fill(1), 2.5], legends: ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT'] },
      { count: 7, widths: [1.5, 1.25, 1.25, 6.0, 1.25, 1.25, 1.5], legends: ['CTRL', 'WIN', 'ALT', '', 'ALT', 'FN', 'CTRL'] }
    ];

    type KeyObject = {
      position: [number, number, number];
      width: number;
      isSpacebar: boolean;
      id: string;
      legend: string;
      color: string;
      textColor: string;
      explodeDir: Vector3;
      explodeRot: Euler;
    };

    const keyObjects: KeyObject[] = [];
    let zOffset = -3.5;

    const accentKeys = ['ESC', 'ENTER'];
    const modifierKeys = ['TAB', 'CAPS', 'SHIFT', 'CTRL', 'WIN', 'ALT', 'FN', 'BACK', 'DEL', '~', '\\'];

    layout.forEach((row, rowIndex) => {
      let xOffset = -7.5;
      const numKeys = row.widths.length > 0 ? row.widths.length : row.count;

      for (let i = 0; i < numKeys; i++) {
        const width = row.widths.length > 0 ? row.widths[i] : 1;
        const isSpacebar = rowIndex === 5 && i === 3;
        const legend = row.legends[i] || '';

        let color = '#D7D0C0'; // Beige/Off-white alphas
        let textColor = '#111111'; // Black text

        if (accentKeys.includes(legend)) {
          color = '#8B1E28'; // Deep Red accents
          textColor = '#FFFFFF';
        } else if (modifierKeys.includes(legend) || rowIndex === 5 || legend === '') {
          color = '#222222'; // Dark Grey modifiers
          textColor = '#EAEAEA';
        }

        const xPos = xOffset + width / 2;

        // Deterministic pseudo-random based on key index
        const seed = rowIndex * 100 + i + 1;
        const rand1 = Math.abs(Math.sin(seed) * 10000) % 1;
        const rand2 = Math.abs(Math.cos(seed) * 10000) % 1;
        const rand3 = Math.abs(Math.tan(seed) * 10000) % 1;
        const rand4 = Math.abs(Math.sin(seed * 2) * 10000) % 1;
        const rand5 = Math.abs(Math.cos(seed * 2) * 10000) % 1;
        const rand6 = Math.abs(Math.tan(seed * 2) * 10000) % 1;

        // Calculate a random outward direction for the explode effect
        const explodeDir = new Vector3(
          (xPos) * (rand1 * 0.5 + 0.5) + (rand2 - 0.5) * 5,
          rand3 * 10 + 5,
          (zOffset) * (rand4 * 0.5 + 0.5) + (rand5 - 0.5) * 5
        );
        const explodeRot = new Euler(
          rand1 * Math.PI * 2,
          rand2 * Math.PI * 2,
          rand6 * Math.PI * 2
        );

        keyObjects.push({
          position: [xPos, 0.4, zOffset],
          width: width - 0.15,
          isSpacebar,
          id: `${rowIndex}-${i}`,
          legend,
          color,
          textColor,
          explodeDir,
          explodeRot
        });

        xOffset += width;
      }
      zOffset += 1.2;
    });

    return keyObjects;
  }, []);

  const keyRefs = useRef<(Group | null)[]>([]);
  const glowRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const explodeP = Math.max(0, Math.min(1, explodeProgress?.current ?? 0));

    if (group.current) {
      if (explodeP < 0.01) {
        // Just entered, smooth transition to normal
        group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, 0.4, 0.05);
        group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, 0, 0.05);
      } else {
        const floatY = Math.sin(t * 1.5) * 0.08 * (1 - explodeP);
        const targetRotationX = 0.4 + (state.pointer.y * Math.PI) / 40;
        const targetRotationY = (state.pointer.x * Math.PI) / 40;

        group.current.position.y = floatY;

        // Massive parallax and push back on explosion
        group.current.position.x = MathUtils.lerp(0, 20, explodeP);
        group.current.position.z = MathUtils.lerp(0, -15, explodeP);

        group.current.rotation.x = MathUtils.lerp(targetRotationX, targetRotationX + explodeP * Math.PI, 0.05);
        group.current.rotation.y = MathUtils.lerp(targetRotationY, targetRotationY + explodeP * (Math.PI / 2), 0.05);
      }
    }

    if (baseRef.current) {
      baseRef.current.position.y = MathUtils.lerp(-0.15, -20 * explodeP, 0.1);
      baseRef.current.rotation.x = MathUtils.lerp(0, explodeP * Math.PI * 0.5, 0.1);
    }

    // Fade out glow as it explodes
    if (glowRef.current && glowRef.current.children.length > 0) {
       const mesh = glowRef.current.children[0] as Mesh;
       const glowMaterial = mesh.material as MeshPhysicalMaterial;
       if (glowMaterial) {
           glowMaterial.emissiveIntensity = MathUtils.lerp(isSpacePressed ? 2 : 0.5, 0, explodeP);
       }
    }

    keyRefs.current.forEach((keyNode, index) => {
      if (!keyNode) return;
      const keyData = keys[index];

      const targetX = keyData.position[0] + keyData.explodeDir.x * explodeP * 4;
      const targetY = keyData.position[1] + keyData.explodeDir.y * explodeP * 4;
      const targetZ = keyData.position[2] + keyData.explodeDir.z * explodeP * 4;

      if (keyData.isSpacebar && explodeP === 0) {
        const targetSpaceY = isSpacePressed ? 0.05 : 0.4;
        keyNode.position.y = MathUtils.lerp(keyNode.position.y, targetSpaceY, 0.2);
      } else {
        keyNode.position.x = MathUtils.lerp(keyNode.position.x, targetX, 0.1);
        keyNode.position.y = MathUtils.lerp(keyNode.position.y, targetY, 0.1);
        keyNode.position.z = MathUtils.lerp(keyNode.position.z, targetZ, 0.1);
      }

      keyNode.rotation.x = MathUtils.lerp(0, keyData.explodeRot.x * explodeP * 3, 0.1);
      keyNode.rotation.y = MathUtils.lerp(0, keyData.explodeRot.y * explodeP * 3, 0.1);
      keyNode.rotation.z = MathUtils.lerp(0, keyData.explodeRot.z * explodeP * 3, 0.1);
    });
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 9, 12]} rotation={[-0.58, 0, 0]} fov={45} />
      {/* Local-only studio rig: no remote HDR dependency. */}
      <ambientLight intensity={1.3} />
      <directionalLight position={[-8, 12, 8]} intensity={3.2} color="#fff4df" />
      <directionalLight position={[9, 6, -4]} intensity={2.4} color="#d92d20" />
      <pointLight position={[0, 8, 2]} intensity={80} distance={30} color="#ffffff" />

      <group ref={group} rotation={[0.4, 0, 0]}>

        {/* Contact shadow for grounding */}
        <ContactShadows position={[0, -1, 0]} opacity={0.8} scale={30} blur={2.5} far={10} color="#000000" />

        <group ref={baseRef}>
          {/* Anodized Aluminum Base - Dark Charcoal */}
          <RoundedBox args={[16.8, 0.5, 7.8]} radius={0.15} smoothness={4} position={[0, 0, 0]}>
            <meshPhysicalMaterial
              color="#1a1a1a"
              metalness={0.7}
              roughness={0.4}
              clearcoat={0.2}
              clearcoatRoughness={0.2}
            />
          </RoundedBox>

          <group ref={glowRef}>
            {/* Soft Red Underglow Plate */}
            <mesh position={[0, -0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[16.2, 7.2]} />
              <meshPhysicalMaterial
                color="#000000"
                emissive="#ff1111"
                emissiveIntensity={isSpacePressed ? 1.2 : 0.12}
              />
            </mesh>
          </group>
        </group>

        <group ref={keysGroup}>
          {keys.map((k, i) => {
            return (
              <group
                key={k.id}
                position={k.position}
                ref={(el) => { keyRefs.current[i] = el; }}
              >
                {/* Keycap Body */}
                <RoundedBox args={[k.width, 0.5, 1.05]} radius={0.08} smoothness={3}>
                  <meshPhysicalMaterial
                    color={k.color}
                    roughness={0.7}
                    metalness={0.05}
                    clearcoat={0.1}
                    clearcoatRoughness={0.3}
                  />
                </RoundedBox>

                {/* Spacebar Underglow (Red) */}
                {k.isSpacebar && (
                  <mesh position={[0, -0.2, 0]}>
                    <boxGeometry args={[k.width + 0.05, 0.1, 1.1]} />
                    <meshPhysicalMaterial
                      color="#222222"
                      emissive="#ff1111"
                      emissiveIntensity={isSpacePressed ? 4 : 0}
                    />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>
      </group>
    </>
  );
}
