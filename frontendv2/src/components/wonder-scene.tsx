interface WonderSceneProps {
  variant?: "hero" | "category" | "detail" | "about";
  badge?: string;
  title: string;
  caption: string;
  mascot?: string;
  stickers?: string[];
}

const scenePresets = {
  hero: {
    badge: "Wonder Field",
    mascot: "🍄",
    stickers: ["⭐", "🌈", "🪙"],
  },
  category: {
    badge: "Zone Select",
    mascot: "🌟",
    stickers: ["🎮", "✨", "🧱"],
  },
  detail: {
    badge: "Skill Stage",
    mascot: "🍄",
    stickers: ["🪄", "⭐", "🎈"],
  },
  about: {
    badge: "Story Room",
    mascot: "🌼",
    stickers: ["💫", "📖", "🪙"],
  },
} as const;

export const WonderScene = ({
  variant = "hero",
  badge,
  title,
  caption,
  mascot,
  stickers,
}: WonderSceneProps) => {
  const preset = scenePresets[variant];
  const sceneStickers = stickers ?? preset.stickers;

  return (
    <div className={`wonder-scene wonder-scene-${variant}`} aria-hidden="true">
      <span className="wonder-cloud wonder-cloud-a" />
      <span className="wonder-cloud wonder-cloud-b" />

      {sceneStickers.slice(0, 3).map((sticker, index) => (
        <span className={`wonder-scene-sticker wonder-scene-sticker-${index + 1}`} key={index}>
          {sticker}
        </span>
      ))}

      <div className="wonder-scene-shell">
        <span className="wonder-scene-label">{badge ?? preset.badge}</span>

        <div className="wonder-scene-view">
          <div className="wonder-scene-aura" />
          <span className="wonder-scene-token wonder-scene-token-a">🪙</span>
          <span className="wonder-scene-token wonder-scene-token-b">✨</span>
          <div className="wonder-scene-avatar">{mascot ?? preset.mascot}</div>
          <div className="wonder-scene-plaque">
            <strong>{title}</strong>
            <span>{caption}</span>
          </div>
          <div className="wonder-scene-pedestal" />
        </div>

        <div className="wonder-scene-ground">
          <span className="wonder-hill wonder-hill-a" />
          <span className="wonder-hill wonder-hill-b" />
          <span className="wonder-bush wonder-bush-a" />
          <span className="wonder-bush wonder-bush-b" />
        </div>
      </div>
    </div>
  );
};
