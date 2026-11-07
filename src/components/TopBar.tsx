import { setMuted, useProgress } from '../storage/progress';

export function MuteButton() {
  const { settings } = useProgress();
  return (
    <button
      className="icon-btn"
      onClick={() => setMuted(!settings.muted)}
      aria-label={settings.muted ? 'הפעל צלילים' : 'השתק צלילים'}
      title={settings.muted ? 'הפעל צלילים' : 'השתק צלילים'}
    >
      {settings.muted ? '🔇' : '🔊'}
    </button>
  );
}

/** Top bar: title on the right, back button and actions. */
export function TopBar({
  title,
  onBack,
  backLabel = 'חזרה',
  children,
}: {
  title?: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="topbar">
      <div className="topbar__start">
        {onBack && (
          <button className="icon-btn" onClick={onBack} aria-label={backLabel} title={backLabel}>
            {/* in RTL, "back" points right */}→
          </button>
        )}
        {title && <h1 className="topbar__title">{title}</h1>}
      </div>
      <div className="topbar__end">
        {children}
        <MuteButton />
      </div>
    </header>
  );
}
