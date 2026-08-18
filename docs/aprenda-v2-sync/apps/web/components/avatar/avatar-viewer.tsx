"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { AvatarConfig } from "@/lib/avatar-config";
import { AvatarCharacter } from "@/components/avatar/avatar-character";

type AvatarViewerProps = {
  config: AvatarConfig;
  className?: string;
  autoRotate?: boolean;
};

export function AvatarViewer({ config, className, autoRotate = true }: AvatarViewerProps) {
  return (
    <div className={className ?? "h-full w-full"}>
      <Canvas
        camera={{ position: [0, 1.4, 3.2], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#f6f8f3"]} />
        <ambientLight intensity={0.7} />
        <hemisphereLight args={["#e2e8f0", "#58CC02", 0.35]} />
        <directionalLight position={[3, 5, 4]} intensity={1.15} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} />
        <group position={[0, -0.15, 0]}>
          <AvatarCharacter config={config} />
        </group>
        <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={6} blur={2.2} far={2.5} />
        <OrbitControls
          enablePan={false}
          minDistance={2.2}
          maxDistance={5}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.7}
          target={[0, 1.05, 0]}
          autoRotate={autoRotate}
          autoRotateSpeed={1.4}
        />
      </Canvas>
    </div>
  );
}
