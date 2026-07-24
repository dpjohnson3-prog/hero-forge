import ExerciseFigure from './ExerciseFigure'
import { POSES } from '../../data/exercisePoses'

// Small original equipment glyphs, layered behind the figure. Positioned to
// read clearly against the pose they're paired with in exerciseLibrary.js
// rather than dynamically attached to joints — plenty precise at icon scale.
const EQUIPMENT = {
  barbellHigh: (
    <g strokeLinecap="round">
      <line x1="18" y1="26" x2="82" y2="26" />
      <circle cx="18" cy="26" r="6" />
      <circle cx="82" cy="26" r="6" />
    </g>
  ),
  barbellShoulder: (
    <g strokeLinecap="round">
      <line x1="24" y1="38" x2="76" y2="38" />
      <circle cx="24" cy="38" r="5.5" />
      <circle cx="76" cy="38" r="5.5" />
    </g>
  ),
  barbellChest: (
    <g strokeLinecap="round">
      <line x1="12" y1="46" x2="72" y2="46" />
      <circle cx="12" cy="46" r="5.5" />
      <circle cx="72" cy="46" r="5.5" />
    </g>
  ),
  barbellLow: (
    <g strokeLinecap="round">
      <line x1="22" y1="90" x2="78" y2="90" />
      <circle cx="22" cy="90" r="6" />
      <circle cx="78" cy="90" r="6" />
    </g>
  ),
  dumbbells: (
    <g strokeLinecap="round">
      <line x1="18" y1="55" x2="30" y2="55" />
      <circle cx="15" cy="55" r="4.5" />
      <circle cx="33" cy="55" r="4.5" />
      <line x1="70" y1="55" x2="82" y2="55" />
      <circle cx="67" cy="55" r="4.5" />
      <circle cx="85" cy="55" r="4.5" />
    </g>
  ),
  cableStack: (
    <g strokeLinecap="round">
      <rect x="82" y="12" width="12" height="76" rx="2" />
      <line x1="82" y1="24" x2="94" y2="24" />
      <line x1="82" y1="34" x2="94" y2="34" />
      <line x1="82" y1="44" x2="94" y2="44" />
      <circle cx="88" cy="10" r="3" />
      <line x1="88" y1="13" x2="60" y2="45" />
    </g>
  ),
  benchFlat: (
    <g strokeLinecap="round">
      <rect x="18" y="82" width="64" height="7" rx="2" />
      <line x1="24" y1="89" x2="24" y2="96" />
      <line x1="76" y1="89" x2="76" y2="96" />
    </g>
  ),
  pullupBar: (
    <g strokeLinecap="round">
      <line x1="14" y1="14" x2="86" y2="14" />
      <line x1="20" y1="6" x2="20" y2="14" />
      <line x1="80" y1="6" x2="80" y2="14" />
    </g>
  ),
  kettlebellObj: (
    <g strokeLinecap="round">
      <path d="M42,58 a8,8 0 0 1 16,0" fill="none" />
      <circle cx="50" cy="72" r="13" />
    </g>
  ),
  heavyBag: (
    <g strokeLinecap="round">
      <line x1="80" y1="4" x2="80" y2="12" />
      <rect x="70" y="12" width="20" height="46" rx="10" />
    </g>
  ),
  speedBag: (
    <g strokeLinecap="round">
      <line x1="78" y1="4" x2="78" y2="18" />
      <circle cx="78" cy="26" r="8" />
    </g>
  ),
  plyoBox: (
    <g strokeLinecap="round">
      <rect x="58" y="70" width="30" height="22" rx="1.5" />
    </g>
  ),
  ropeCeiling: (
    <g strokeLinecap="round">
      <path d="M22,4 Q30,20 20,34 Q10,48 22,60" fill="none" />
    </g>
  ),
  trxStraps: (
    <g strokeLinecap="round">
      <line x1="30" y1="2" x2="20" y2="30" />
      <line x1="70" y1="2" x2="80" y2="30" />
    </g>
  ),
  sledObj: (
    <g strokeLinecap="round">
      <rect x="10" y="80" width="26" height="10" rx="2" />
      <line x1="36" y1="80" x2="46" y2="60" />
      <line x1="36" y1="90" x2="46" y2="68" />
    </g>
  ),
  machineSeat: (
    <g strokeLinecap="round">
      <rect x="34" y="84" width="32" height="8" rx="2" />
      <line x1="40" y1="84" x2="40" y2="70" />
    </g>
  ),
  treadmillDeck: (
    <g strokeLinecap="round">
      <rect x="14" y="90" width="72" height="6" rx="2" />
      <line x1="20" y1="90" x2="30" y2="70" />
    </g>
  ),
  rowerSeat: (
    <g strokeLinecap="round">
      <rect x="8" y="88" width="70" height="5" rx="2" />
      <circle cx="20" cy="84" r="5" />
      <line x1="78" y1="90" x2="90" y2="60" />
    </g>
  ),
  stairsObj: (
    <g strokeLinecap="round">
      <path d="M10,92 h16 v-14 h16 v-14 h16 v-14 h16" fill="none" />
    </g>
  ),
  medicineBall: (
    <g strokeLinecap="round">
      <circle cx="50" cy="88" r="10" />
    </g>
  ),
  tireObj: (
    <g strokeLinecap="round">
      <ellipse cx="50" cy="90" rx="22" ry="9" />
    </g>
  ),
  sledgehammerObj: (
    <g strokeLinecap="round">
      <ellipse cx="50" cy="93" rx="22" ry="7" />
      <line x1="70" y1="20" x2="52" y2="70" />
      <rect x="66" y="10" width="16" height="10" rx="2" transform="rotate(30 74 15)" />
    </g>
  ),
  plateObj: (
    <g strokeLinecap="round">
      <circle cx="50" cy="55" r="10" fill="none" />
      <circle cx="50" cy="55" r="3" fill="currentColor" stroke="none" />
    </g>
  ),
  gripperObj: (
    <g strokeLinecap="round">
      <path d="M38,55 a12,10 0 0 1 24,0" fill="none" />
    </g>
  ),
  jumpRopeObj: (
    <g strokeLinecap="round">
      <path d="M28,30 Q50,90 72,30" fill="none" />
    </g>
  ),
  bikeObj: (
    <g strokeLinecap="round">
      <circle cx="26" cy="88" r="9" />
      <circle cx="80" cy="88" r="9" />
      <line x1="26" y1="88" x2="52" y2="60" />
      <line x1="80" y1="88" x2="52" y2="60" />
      <line x1="52" y1="60" x2="60" y2="40" />
    </g>
  ),
}

export default function ExerciseIcon({ pose, equipment, className }) {
  const p = POSES[pose] ?? POSES.stand
  const eq = equipment ? EQUIPMENT[equipment] : null

  return (
    <svg viewBox="0 0 100 100" className={className}>
      {eq && (
        <g fill="none" stroke="currentColor" strokeWidth="3.5" opacity="0.45">
          {eq}
        </g>
      )}
      <ExerciseFigure pose={p} />
    </svg>
  )
}
