"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { AvatarConfig } from "@/lib/avatar-config";

type AccessoryProps = {
  itemKey?: string;
  hairColor: string;
};

function Hair({ itemKey, hairColor }: AccessoryProps) {
  switch (itemKey) {
    case "hair-curly":
      return (
        <group>
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.85} />
          </mesh>
          {[-0.18, 0, 0.18].map((x) =>
            [-0.1, 0.12].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0.22, z]}>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshStandardMaterial color={hairColor} roughness={0.9} />
              </mesh>
            ))
          )}
        </group>
      );
    case "hair-long":
      return (
        <group>
          <mesh position={[0, 0.16, -0.02]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0, -0.12, -0.16]} rotation={[0.35, 0, 0]}>
            <capsuleGeometry args={[0.14, 0.42, 4, 10]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </group>
      );
    case "hair-bun":
      return (
        <group>
          <mesh position={[0, 0.16, -0.02]}>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0, 0.28, -0.18]}>
            <sphereGeometry args={[0.12, 14, 14]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </group>
      );
    case "hair-mohawk":
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.08, 0.28, 0.36]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </group>
      );
    case "hair-ponytail":
      return (
        <group>
          <mesh position={[0, 0.16, -0.02]}>
            <sphereGeometry args={[0.27, 16, 16]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0, -0.02, -0.28]} rotation={[0.8, 0, 0]}>
            <capsuleGeometry args={[0.07, 0.32, 4, 10]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </group>
      );
    case "hair-short":
    default:
      return (
        <mesh position={[0, 0.14, -0.02]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      );
  }
}

function Hat({ itemKey }: { itemKey?: string }) {
  switch (itemKey) {
    case "hat-beanie":
      return (
        <group position={[0, 0.28, 0]}>
          <mesh>
            <sphereGeometry args={[0.26, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      );
    case "hat-cap":
      return (
        <group position={[0, 0.26, 0]}>
          <mesh>
            <cylinderGeometry args={[0.24, 0.26, 0.1, 16]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0, -0.02, 0.2]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.28, 0.03, 0.16]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      );
    case "hat-crown":
      return (
        <group position={[0, 0.32, 0]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.2, 0.12, 5]} />
            <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.25} />
          </mesh>
          {[-0.12, -0.04, 0.04, 0.12].map((x) => (
            <mesh key={x} position={[x, 0.1, 0]}>
              <coneGeometry args={[0.035, 0.1, 6]} />
              <meshStandardMaterial color="#facc15" metalness={0.6} />
            </mesh>
          ))}
        </group>
      );
    case "hat-wizard":
      return (
        <group position={[0, 0.38, 0]}>
          <mesh>
            <coneGeometry args={[0.22, 0.55, 10]} />
            <meshStandardMaterial color="#6d28d9" />
          </mesh>
          <mesh position={[0.08, 0.05, 0.12]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.4} />
          </mesh>
        </group>
      );
    case "hat-headphones":
      return (
        <group position={[0, 0.08, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.22, 0]}>
            <torusGeometry args={[0.28, 0.025, 8, 20, Math.PI]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[-0.3, 0.04, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0.3, 0.04, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </group>
      );
    case "hat-propeller":
      return (
        <group position={[0, 0.28, 0]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.24, 0.1, 16]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[0.36, 0.02, 0.06]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      );
    case "hat-helmet":
      return (
        <group position={[0, 0.12, 0.02]}>
          <mesh>
            <sphereGeometry args={[0.34, 20, 16, 0, Math.PI * 2, 0, Math.PI / 1.45]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.55} roughness={0.2} transparent opacity={0.45} />
          </mesh>
          <mesh position={[0, -0.04, 0.02]}>
            <torusGeometry args={[0.3, 0.03, 8, 20]} />
            <meshStandardMaterial color="#64748b" metalness={0.5} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Glasses({ itemKey }: { itemKey?: string }) {
  switch (itemKey) {
    case "glasses-round":
      return (
        <group position={[0, 0.02, 0.28]}>
          <mesh position={[-0.1, 0, 0]}>
            <torusGeometry args={[0.07, 0.012, 8, 16]} />
            <meshStandardMaterial color="#1C1F4A" />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
            <torusGeometry args={[0.07, 0.012, 8, 16]} />
            <meshStandardMaterial color="#1C1F4A" />
          </mesh>
          <mesh>
            <boxGeometry args={[0.06, 0.012, 0.012]} />
            <meshStandardMaterial color="#1C1F4A" />
          </mesh>
        </group>
      );
    case "glasses-pixel":
      return (
        <group position={[0, 0.02, 0.29]}>
          <mesh>
            <boxGeometry args={[0.36, 0.1, 0.04]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.3, 0.06, 0.02]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
          </mesh>
        </group>
      );
    case "glasses-visor":
      return (
        <mesh position={[0, 0.03, 0.28]}>
          <boxGeometry args={[0.38, 0.08, 0.05]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.7} roughness={0.15} emissive="#0891b2" emissiveIntensity={0.25} />
        </mesh>
      );
    case "glasses-star":
      return (
        <group position={[0, 0.02, 0.28]}>
          {[-0.1, 0.1].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.08, 0.02, 5]} />
              <meshStandardMaterial color="#eab308" />
            </mesh>
          ))}
        </group>
      );
    default:
      return null;
  }
}

function Face({ itemKey }: { itemKey?: string }) {
  switch (itemKey) {
    case "face-mask":
      return (
        <mesh position={[0, -0.08, 0.26]}>
          <boxGeometry args={[0.28, 0.16, 0.06]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      );
    case "face-blush":
      return (
        <group position={[0, -0.06, 0.26]}>
          <mesh position={[-0.14, 0, 0]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#f9a8d4" transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.14, 0, 0]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#f9a8d4" transparent opacity={0.8} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Neck({ itemKey }: { itemKey?: string }) {
  switch (itemKey) {
    case "neck-scarf":
      return (
        <mesh position={[0, 1.28, 0.04]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.18, 0.06, 8, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      );
    case "neck-bowtie":
      return (
        <group position={[0, 1.22, 0.22]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.12, 4]} />
            <meshStandardMaterial color="#1C1F4A" />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.12, 4]} />
            <meshStandardMaterial color="#1C1F4A" />
          </mesh>
        </group>
      );
    case "neck-medal":
      return (
        <group position={[0, 1.05, 0.22]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.03, 0.16, 0.01]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Cape({ itemKey }: { itemKey?: string }) {
  const color = itemKey === "cape-hero" ? "#dc2626" : "#58CC02";
  if (itemKey !== "cape-green" && itemKey !== "cape-hero") return null;
  return (
    <mesh position={[0, 0.85, -0.22]} rotation={[0.25, 0, 0]}>
      <boxGeometry args={[0.7, 0.9, 0.05]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Backpack({ itemKey }: { itemKey?: string }) {
  switch (itemKey) {
    case "backpack-school":
      return (
        <mesh position={[0, 0.9, -0.28]}>
          <boxGeometry args={[0.32, 0.38, 0.16]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      );
    case "backpack-rocket":
      return (
        <group position={[0, 0.85, -0.32]}>
          <mesh>
            <capsuleGeometry args={[0.12, 0.35, 4, 10]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          <mesh position={[0, -0.28, 0]}>
            <coneGeometry args={[0.1, 0.16, 10]} />
            <meshStandardMaterial color="#facc15" emissive="#f97316" emissiveIntensity={0.4} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Hands({ itemKey }: { itemKey?: string }) {
  switch (itemKey) {
    case "hands-laptop":
      return (
        <mesh position={[0.42, 0.72, 0.18]} rotation={[-0.5, 0.4, 0]}>
          <boxGeometry args={[0.28, 0.02, 0.2]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} />
        </mesh>
      );
    case "hands-wand":
      return (
        <group position={[0.42, 0.85, 0.12]} rotation={[0.4, 0, 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
            <meshStandardMaterial color="#7c3aed" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial color="#e879f9" emissive="#a855f7" emissiveIntensity={0.5} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Pet({ itemKey }: { itemKey?: string }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = 0.55 + Math.sin(state.clock.elapsedTime * 2.2) * 0.08;
    ref.current.rotation.y = state.clock.elapsedTime * 0.6;
  });

  if (!itemKey) return null;

  return (
    <group ref={ref} position={[0.7, 0.55, 0.15]}>
      {itemKey === "pet-cat" ? (
        <>
          <mesh>
            <sphereGeometry args={[0.14, 14, 14]} />
            <meshStandardMaterial color="#fb923c" />
          </mesh>
          <mesh position={[-0.08, 0.14, 0]}>
            <coneGeometry args={[0.05, 0.08, 4]} />
            <meshStandardMaterial color="#fb923c" />
          </mesh>
          <mesh position={[0.08, 0.14, 0]}>
            <coneGeometry args={[0.05, 0.08, 4]} />
            <meshStandardMaterial color="#fb923c" />
          </mesh>
        </>
      ) : null}
      {itemKey === "pet-bug" ? (
        <>
          <mesh>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
        </>
      ) : null}
      {itemKey === "pet-robot" ? (
        <>
          <mesh>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[0.12, 0.1, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
          <mesh position={[-0.03, 0.16, 0.07]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#58CC02" emissive="#58CC02" />
          </mesh>
          <mesh position={[0.03, 0.16, 0.07]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#58CC02" emissive="#58CC02" />
          </mesh>
        </>
      ) : null}
    </group>
  );
}

function Limb({
  position,
  rotation,
  color,
  radius = 0.08,
  length = 0.42,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  radius?: number;
  length?: number;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <capsuleGeometry args={[radius, length, 4, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function AvatarCharacter({ config }: { config: AvatarConfig }) {
  const group = useRef<Group>(null);
  const { skinTone, hairColor, shirtColor, pantsColor, equipped } = config;

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.03;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.95, 0]}>
        <capsuleGeometry args={[0.28, 0.5, 6, 12]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      <Limb position={[-0.34, 0.95, 0]} rotation={[0, 0, 0.45]} color={shirtColor} />
      <Limb position={[0.34, 0.95, 0]} rotation={[0, 0, -0.45]} color={shirtColor} />
      <Limb position={[-0.14, 0.28, 0]} color={pantsColor} radius={0.09} length={0.38} />
      <Limb position={[0.14, 0.28, 0]} color={pantsColor} radius={0.09} length={0.38} />

      <mesh position={[-0.14, 0.02, 0.04]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.14, 0.02, 0.04]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      <Cape itemKey={equipped.cape} />
      <Backpack itemKey={equipped.backpack} />
      <Neck itemKey={equipped.neck} />
      <Hands itemKey={equipped.hands} />

      <group position={[0, 1.55, 0]}>
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
        <mesh position={[-0.1, 0.04, 0.26]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0.1, 0.04, 0.26]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0, -0.08, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <Hair itemKey={equipped.hair} hairColor={hairColor} />
        <Hat itemKey={equipped.hat} />
        <Glasses itemKey={equipped.glasses} />
        <Face itemKey={equipped.face} />
      </group>

      <Pet itemKey={equipped.pet} />
    </group>
  );
}
