"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Gem, Loader2, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AvatarConfig, AvatarSlot } from "@/lib/avatar-config";
import { DEFAULT_AVATAR_CONFIG, slotLabel } from "@/lib/avatar-config";
import {
  FREE_HAIR_COLORS,
  NEON_HAIR_COLORS,
  PANTS_COLORS,
  PASTEL_HAIR_COLORS,
  SHIRT_COLORS,
  SKIN_TONES,
  getItemsBySlot,
  rarityLabel,
  type AvatarItem,
  type AvatarRarity,
} from "@/lib/avatar-items";

const AvatarViewer = dynamic(
  () => import("@/components/avatar/avatar-viewer").then((mod) => mod.AvatarViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-navy/50 text-sm font-semibold">
        Carregando avatar 3D...
      </div>
    ),
  }
);

type StudioTab = "look" | AvatarSlot;

type AvatarApiResponse = {
  gems: number;
  config: AvatarConfig;
  ownedKeys: string[];
  catalog: AvatarItem[];
};

const TABS: { id: StudioTab; label: string }[] = [
  { id: "look", label: "Aparência" },
  { id: "hair", label: "Cabelo" },
  { id: "hat", label: "Chapéus" },
  { id: "glasses", label: "Óculos" },
  { id: "face", label: "Rosto" },
  { id: "neck", label: "Pescoço" },
  { id: "cape", label: "Capas" },
  { id: "backpack", label: "Mochilas" },
  { id: "hands", label: "Mãos" },
  { id: "pet", label: "Mascotes" },
  { id: "palette", label: "Paletas" },
];

function rarityClass(rarity: AvatarRarity): string {
  switch (rarity) {
    case "common":
      return "text-navy/60";
    case "rare":
      return "text-blue-600";
    case "epic":
      return "text-violet-600";
    case "legendary":
      return "text-amber-600";
    default: {
      const _exhaustive: never = rarity;
      return _exhaustive;
    }
  }
}

export function AvatarStudio() {
  const [tab, setTab] = useState<StudioTab>("look");
  const [gems, setGems] = useState(0);
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [ownedKeys, setOwnedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const owned = useMemo(() => new Set(ownedKeys), [ownedKeys]);

  const load = useCallback(async () => {
    const res = await fetch("/api/avatar");
    if (!res.ok) {
      throw new Error("Não foi possível carregar o avatar");
    }
    const data = (await res.json()) as AvatarApiResponse;
    setGems(data.gems);
    setConfig(data.config);
    setOwnedKeys(data.ownedKeys);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) setError("Não foi possível carregar o estúdio do avatar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function patchAppearance(partial: Partial<Pick<AvatarConfig, "skinTone" | "hairColor" | "shirtColor" | "pantsColor">>) {
    setError("");
    const res = await fetch("/api/avatar/appearance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Não foi possível salvar a aparência");
      return;
    }
    setConfig(data.config);
  }

  async function purchase(item: AvatarItem) {
    setBusyKey(item.key);
    setError("");
    try {
      const res = await fetch("/api/avatar/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemKey: item.key }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Compra não concluída");
        return;
      }
      setGems(data.gems);
      setOwnedKeys((current) => [...current, item.key]);
    } finally {
      setBusyKey(null);
    }
  }

  async function equip(slot: Exclude<AvatarSlot, "palette">, itemKey: string | null) {
    setBusyKey(itemKey ?? `unequip-${slot}`);
    setError("");
    try {
      const res = await fetch("/api/avatar/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, itemKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível equipar");
        return;
      }
      setConfig(data.config);
    } finally {
      setBusyKey(null);
    }
  }

  const tabItems = tab === "look" || tab === "palette" ? getItemsBySlot("palette") : getItemsBySlot(tab);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <Sparkles className="h-4 w-4" />
            Estúdio 3D
          </p>
          <h1 className="text-3xl font-extrabold text-navy mt-1">Seu avatar</h1>
          <p className="text-navy/60 mt-1 max-w-xl">
            Customize seu personagem e compre acessórios com gemas na loja.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-extrabold text-primary">
          <Gem className="h-5 w-5" />
          {gems} gemas
        </div>
      </header>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
        <section className="card-elevation overflow-hidden rounded-3xl border border-navy/5 bg-white">
          <div className="h-[420px] w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-navy/40">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <AvatarViewer config={config} />
            )}
          </div>
        </section>

        <section className="card-elevation rounded-3xl border border-navy/5 bg-white p-4 sm:p-6">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {TABS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setTab(entry.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  tab === entry.id
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-navy/5 text-navy/70 hover:bg-navy/10"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>

          {tab === "look" ? (
            <div className="space-y-6">
              <ColorRow
                title="Tom de pele"
                colors={SKIN_TONES.map((tone) => ({ ...tone, locked: false }))}
                selected={config.skinTone}
                onSelect={(hex) => patchAppearance({ skinTone: hex })}
              />
              <ColorRow
                title="Cabelo"
                colors={[
                  ...FREE_HAIR_COLORS.map((color) => ({ ...color, locked: false })),
                  ...NEON_HAIR_COLORS.map((color) => ({
                    ...color,
                    locked: !owned.has("palette-neon"),
                  })),
                  ...PASTEL_HAIR_COLORS.map((color) => ({
                    ...color,
                    locked: !owned.has("palette-pastel"),
                  })),
                ]}
                selected={config.hairColor}
                onSelect={(hex) => patchAppearance({ hairColor: hex })}
              />
              <ColorRow
                title="Camisa"
                colors={SHIRT_COLORS.map((color) => ({ ...color, locked: false }))}
                selected={config.shirtColor}
                onSelect={(hex) => patchAppearance({ shirtColor: hex })}
              />
              <ColorRow
                title="Calça"
                colors={PANTS_COLORS.map((color) => ({ ...color, locked: false }))}
                selected={config.pantsColor}
                onSelect={(hex) => patchAppearance({ pantsColor: hex })}
              />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {tabItems.map((item) => {
                const isOwned = owned.has(item.key);
                const isEquipped =
                  item.slot !== "palette" && config.equipped[item.slot] === item.key;
                const busy = busyKey === item.key || busyKey === `unequip-${item.slot}`;

                return (
                  <article
                    key={item.key}
                    className="rounded-2xl border border-navy/10 p-4 flex flex-col gap-3"
                  >
                    <div
                      className="h-14 w-14 rounded-2xl"
                      style={{ background: item.previewColor }}
                      aria-hidden
                    />
                    <div>
                      <h3 className="font-extrabold text-navy">{item.name}</h3>
                      <p className={`text-xs font-bold ${rarityClass(item.rarity)}`}>
                        {rarityLabel(item.rarity)} · {slotLabel(item.slot)}
                      </p>
                      <p className="text-sm text-navy/60 mt-1">{item.description}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      {isOwned ? (
                        item.slot === "palette" ? (
                          <span className="text-sm font-bold text-primary">Desbloqueado</span>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant={isEquipped ? "secondary" : "primary"}
                            disabled={busy}
                            onClick={() => equip(item.slot, isEquipped ? null : item.key)}
                          >
                            {isEquipped ? "Remover" : "Equipar"}
                          </Button>
                        )
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          disabled={busy || gems < item.priceGems}
                          onClick={() => purchase(item)}
                        >
                          {busy ? "..." : `Comprar · ${item.priceGems}`}
                          <Gem className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <p className="flex items-center gap-2 text-sm text-navy/50">
        <UserRound className="h-4 w-4" />
        O avatar aparece no seu perfil. Itens comprados ficam no inventário para sempre.
      </p>
    </div>
  );
}

function ColorRow({
  title,
  colors,
  selected,
  onSelect,
}: {
  title: string;
  colors: { key: string; name: string; hex: string; locked: boolean }[];
  selected: string;
  onSelect: (hex: string) => void;
}) {
  return (
    <div>
      <h2 className="text-sm font-extrabold text-navy mb-2">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.key}
            type="button"
            title={color.locked ? `${color.name} (bloqueado)` : color.name}
            disabled={color.locked}
            onClick={() => onSelect(color.hex)}
            className={`h-10 w-10 rounded-full border-2 transition-transform ${
              selected === color.hex ? "border-navy scale-110" : "border-white"
            } ${color.locked ? "opacity-30 cursor-not-allowed" : "hover:scale-110"}`}
            style={{ background: color.hex }}
            aria-label={color.name}
          />
        ))}
      </div>
    </div>
  );
}
