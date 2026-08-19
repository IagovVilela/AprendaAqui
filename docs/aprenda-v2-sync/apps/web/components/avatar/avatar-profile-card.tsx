"use client";

import dynamic from "next/dynamic";
import type { AvatarConfig } from "@/lib/avatar-config";
import { AvatarPreview2D } from "@/components/avatar/avatar-preview-2d";

const AvatarViewer = dynamic(
  () => import("@/components/avatar/avatar-viewer").then((mod) => mod.AvatarViewer),
  { ssr: false }
);

type AvatarProfileCardProps = {
  config: AvatarConfig;
  name: string;
};

export function AvatarProfileCard({ config, name }: AvatarProfileCardProps) {
  return (
    <section className="card-elevation overflow-hidden rounded-3xl border border-navy/5 bg-white">
      <div className="h-64 w-full">
        <AvatarViewer config={config} autoRotate />
      </div>
      <div className="flex items-center gap-3 border-t border-navy/5 px-5 py-4">
        <AvatarPreview2D config={config} size={48} />
        <div>
          <p className="text-sm font-bold text-navy/50">Avatar 3D</p>
          <p className="font-extrabold text-navy">{name}</p>
        </div>
      </div>
    </section>
  );
}
