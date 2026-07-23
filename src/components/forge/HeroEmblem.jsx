// Original, abstract/symbolic marks per hero — shapes and motifs in our own
// design language, not depictions of the copyrighted characters themselves.

function Batman({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <polygon points="50,90 20,60 5,55 25,40 20,15 40,35 50,25 60,35 80,15 75,40 95,55 80,60" />
    </svg>
  )
}

function Nightwing({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <polygon points="50,20 15,60 35,55 50,80 65,55 85,60" />
    </svg>
  )
}

function Daredevil({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="6">
      <circle cx="50" cy="50" r="10" fill="currentColor" stroke="none" />
      <circle cx="50" cy="50" r="24" />
      <circle cx="50" cy="50" r="38" />
    </svg>
  )
}

function Thor({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <polygon points="55,8 25,55 45,55 38,92 78,42 56,42 66,8" />
    </svg>
  )
}

function Superman({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18,72 50,42 82,72" />
      <polyline points="18,50 50,20 82,50" />
    </svg>
  )
}

function CaptainAmerica({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="7">
      <circle cx="50" cy="50" r="40" />
      <circle cx="50" cy="50" r="27" />
      <circle cx="50" cy="50" r="14" />
      <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Hulk({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <rect x="18" y="48" width="64" height="38" rx="10" />
      <rect x="24" y="22" width="13" height="32" rx="6.5" />
      <rect x="42" y="16" width="13" height="38" rx="6.5" />
      <rect x="60" y="16" width="13" height="38" rx="6.5" />
      <rect x="6" y="56" width="20" height="24" rx="10" />
    </svg>
  )
}

function Wolverine({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <polygon points="13,22 23,12 53,82 43,92" />
      <polygon points="35,15 45,5 75,75 65,85" />
      <polygon points="57,10 67,0 97,70 87,80" />
    </svg>
  )
}

function Aquaman({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
      <path d="M50,15 V85 M30,15 V45 M70,15 V45 M18,45 H82" />
    </svg>
  )
}

function BlackPanther({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8,78 28,26 40,58 50,18 60,58 72,26 92,78" />
    </svg>
  )
}

function WonderWoman({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <polygon points="50,5 61,38 96,38 68,58 79,92 50,71 21,92 32,58 4,38 39,38" />
    </svg>
  )
}

function SpiderMan({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4">
      <line x1="50" y1="50" x2="50" y2="6" />
      <line x1="50" y1="50" x2="86" y2="27" />
      <line x1="50" y1="50" x2="86" y2="73" />
      <line x1="50" y1="50" x2="50" y2="94" />
      <line x1="50" y1="50" x2="14" y2="73" />
      <line x1="50" y1="50" x2="14" y2="27" />
      <polygon points="50,20 71,33 71,60 50,79 29,60 29,33" />
      <polygon points="50,35 60,42 60,58 50,66 40,58 40,42" />
    </svg>
  )
}

function Deadpool({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <polygon points="8,13 18,8 92,82 82,87" />
      <polygon points="92,13 82,8 8,82 18,87" />
    </svg>
  )
}

function IronMan({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="6">
      <circle cx="50" cy="50" r="38" />
      <polygon points="50,26 68,38 68,62 50,74 32,62 32,38" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LukeCage({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="9">
      <ellipse cx="34" cy="50" rx="19" ry="26" transform="rotate(-25 34 50)" />
      <ellipse cx="66" cy="50" rx="19" ry="26" transform="rotate(25 66 50)" />
    </svg>
  )
}

function Shazam({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" />
      <polygon points="57,20 34,55 47,55 42,80 68,45 55,45 63,20" />
    </svg>
  )
}

function Default({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <polygon points="50,8 61,38 93,38 67,57 77,89 50,70 23,89 33,57 7,38 39,38" />
    </svg>
  )
}

const EMBLEMS = {
  batman: Batman,
  nightwing: Nightwing,
  daredevil: Daredevil,
  thor: Thor,
  superman: Superman,
  'captain-america': CaptainAmerica,
  hulk: Hulk,
  wolverine: Wolverine,
  aquaman: Aquaman,
  'black-panther': BlackPanther,
  'wonder-woman': WonderWoman,
  'spider-man': SpiderMan,
  deadpool: Deadpool,
  'iron-man': IronMan,
  'luke-cage': LukeCage,
  shazam: Shazam,
}

export default function HeroEmblem({ heroId, className = 'h-6 w-6', style }) {
  const Icon = EMBLEMS[heroId] ?? Default
  return (
    <span className="contents" style={style}>
      <Icon className={className} />
    </span>
  )
}
