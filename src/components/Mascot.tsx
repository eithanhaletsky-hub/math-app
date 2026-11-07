export type Mood = 'happy' | 'cheer' | 'think' | 'oops' | 'wave';

/** Pipi — an original round friend with a star antenna. Pure SVG. */
export function Mascot({ mood = 'happy', size = 110 }: { mood?: Mood; size?: number }) {
  const armsUp = mood === 'cheer';
  const wave = mood === 'wave';
  const pupilDy = mood === 'think' ? -4 : 0;
  const pupilDx = mood === 'think' ? 3 : 0;
  return (
    <svg
      className={`mascot mascot--${mood}`}
      width={size}
      height={size * 1.15}
      viewBox="0 0 120 138"
      role="img"
      aria-label="פיפי"
    >
      <defs>
        <radialGradient id="pipiBody" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#b39bff" />
          <stop offset="100%" stopColor="#6c4bef" />
        </radialGradient>
      </defs>
      {/* antenna + star */}
      <g className="mascot__antenna">
        <path d="M60 36 Q57 22 64 12" stroke="#5b3fd6" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <polygon
          points="64,1 66.9,8 74.5,8.4 68.6,13.2 70.6,20.5 64,16.4 57.4,20.5 59.4,13.2 53.5,8.4 61.1,8"
          fill="#ffd43b"
          stroke="#f59f00"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
      {/* feet */}
      <ellipse cx="44" cy="128" rx="12" ry="6.5" fill="#5b3fd6" />
      <ellipse cx="76" cy="128" rx="12" ry="6.5" fill="#5b3fd6" />
      {/* arms */}
      <g className="mascot__arms" fill="#7c5cff">
        {armsUp ? (
          <>
            <ellipse cx="20" cy="62" rx="8" ry="14" transform="rotate(-35 20 62)" />
            <ellipse cx="100" cy="62" rx="8" ry="14" transform="rotate(35 100 62)" />
          </>
        ) : wave ? (
          <>
            <ellipse cx="17" cy="90" rx="8" ry="13" transform="rotate(20 17 90)" />
            <ellipse className="mascot__wave" cx="100" cy="62" rx="8" ry="14" transform="rotate(35 100 62)" />
          </>
        ) : (
          <>
            <ellipse cx="17" cy="90" rx="8" ry="13" transform="rotate(20 17 90)" />
            <ellipse cx="103" cy="90" rx="8" ry="13" transform="rotate(-20 103 90)" />
          </>
        )}
      </g>
      {/* body */}
      <ellipse cx="60" cy="82" rx="43" ry="45" fill="url(#pipiBody)" />
      <ellipse cx="60" cy="98" rx="26" ry="21" fill="#ede7ff" opacity="0.9" />
      {/* eyes */}
      <ellipse cx="45" cy="70" rx="10.5" ry="12" fill="#fff" />
      <ellipse cx="75" cy="70" rx="10.5" ry="12" fill="#fff" />
      {mood === 'cheer' ? (
        <>
          <path d="M37 72 Q45 62 53 72" stroke="#2b1a5a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M67 72 Q75 62 83 72" stroke="#2b1a5a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <g className="mascot__eyes">
          <circle cx={46 + pupilDx} cy={72 + pupilDy} r="5.5" fill="#2b1a5a" />
          <circle cx={76 + pupilDx} cy={72 + pupilDy} r="5.5" fill="#2b1a5a" />
          <circle cx={48 + pupilDx} cy={70 + pupilDy} r="1.8" fill="#fff" />
          <circle cx={78 + pupilDx} cy={70 + pupilDy} r="1.8" fill="#fff" />
        </g>
      )}
      {mood === 'oops' && (
        <>
          <path d="M36 54 L52 57" stroke="#2b1a5a" strokeWidth="3" strokeLinecap="round" />
          <path d="M84 54 L68 57" stroke="#2b1a5a" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {/* cheeks */}
      <ellipse cx="33" cy="88" rx="6.5" ry="4" fill="#ff8fb1" opacity="0.75" />
      <ellipse cx="87" cy="88" rx="6.5" ry="4" fill="#ff8fb1" opacity="0.75" />
      {/* mouth */}
      {mood === 'cheer' ? (
        <path d="M47 88 Q60 108 73 88 Z" fill="#4a2a8a" />
      ) : mood === 'think' ? (
        <path d="M54 93 Q60 91 67 93" stroke="#2b1a5a" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : mood === 'oops' ? (
        <ellipse cx="60" cy="94" rx="5" ry="6" fill="#4a2a8a" />
      ) : (
        <path d="M49 89 Q60 100 71 89" stroke="#2b1a5a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function MascotSays({ mood, children, size }: { mood?: Mood; children: React.ReactNode; size?: number }) {
  return (
    <div className="mascot-says">
      <Mascot mood={mood} size={size} />
      <div className="bubble">{children}</div>
    </div>
  );
}
