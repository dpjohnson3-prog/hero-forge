// Minimal parametric line-art athlete used to illustrate exercises.
// Every pose is described as a handful of joint angles (0 = up, 90 = right,
// 180 = down, 270 = left) around a fixed skeleton, so every diagram in the
// shared exercise library shares one consistent, original drawing style.

const TORSO = 25
const UPPER_ARM = 15
const FOREARM = 14
const THIGH = 19
const SHIN = 19
const HEAD_R = 7.5

function toRad(deg) {
  return (deg * Math.PI) / 180
}

function extend([x, y], angleDeg, len) {
  const r = toRad(angleDeg)
  return [x + len * Math.sin(r), y - len * Math.cos(r)]
}

export function computeFigure(pose) {
  const {
    hip = [50, 56],
    torso = 0,
    lShoulder = 195,
    lElbow = 195,
    rShoulder = 165,
    rElbow = 165,
    lHip = 195,
    lKnee = 195,
    rHip = 165,
    rKnee = 165,
  } = pose

  const shoulder = extend(hip, torso, TORSO)
  const head = extend(shoulder, torso, HEAD_R + 2.5)
  const lElbowPt = extend(shoulder, lShoulder, UPPER_ARM)
  const lHand = extend(lElbowPt, lElbow, FOREARM)
  const rElbowPt = extend(shoulder, rShoulder, UPPER_ARM)
  const rHand = extend(rElbowPt, rElbow, FOREARM)
  const lKneePt = extend(hip, lHip, THIGH)
  const lFoot = extend(lKneePt, lKnee, SHIN)
  const rKneePt = extend(hip, rHip, THIGH)
  const rFoot = extend(rKneePt, rKnee, SHIN)

  return { hip, shoulder, head, lElbowPt, lHand, rElbowPt, rHand, lKneePt, lFoot, rKneePt, rFoot }
}

export default function ExerciseFigure({ pose, className }) {
  const f = computeFigure(pose)
  const bone = (a, b) => (
    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} strokeLinecap="round" />
  )

  return (
    <g className={className} fill="none" stroke="currentColor" strokeWidth="5.5">
      {bone(f.hip, f.shoulder)}
      {bone(f.shoulder, f.lElbowPt)}
      {bone(f.lElbowPt, f.lHand)}
      {bone(f.shoulder, f.rElbowPt)}
      {bone(f.rElbowPt, f.rHand)}
      {bone(f.hip, f.lKneePt)}
      {bone(f.lKneePt, f.lFoot)}
      {bone(f.hip, f.rKneePt)}
      {bone(f.rKneePt, f.rFoot)}
      <circle cx={f.head[0]} cy={f.head[1]} r={HEAD_R} fill="currentColor" stroke="none" />
    </g>
  )
}
