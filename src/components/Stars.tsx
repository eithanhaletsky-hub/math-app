export function Stars({ count, max = 3, size = 'md' }: { count: number; max?: number; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={`stars stars--${size}`} aria-label={`${count} מתוך ${max} כוכבים`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? 'star star--on' : 'star'} style={{ animationDelay: `${i * 0.2}s` }}>
          ★
        </span>
      ))}
    </span>
  );
}
