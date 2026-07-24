// Named joint-angle presets consumed by ExerciseFigure. Angles: 0 = up,
// 90 = right, 180 = down, 270 = left. Grouped roughly by movement family so
// the shared exercise library can assign the closest silhouette to every
// exercise without hand-drawing a bespoke figure for each one.

export const POSES = {
  stand: { hip: [50, 56], torso: 0, lShoulder: 200, lElbow: 200, rShoulder: 160, rElbow: 160, lHip: 190, lKnee: 190, rHip: 170, rKnee: 170 },

  squat: { hip: [50, 66], torso: 15, lShoulder: 150, lElbow: 70, rShoulder: 210, rElbow: 290, lHip: 220, lKnee: 165, rHip: 140, rKnee: 195 },

  squatHold: { hip: [50, 66], torso: 10, lShoulder: 100, lElbow: 175, rShoulder: 260, rElbow: 185, lHip: 220, lKnee: 165, rHip: 140, rKnee: 195 },

  lunge: { hip: [48, 58], torso: 5, lShoulder: 190, lElbow: 190, rShoulder: 170, rElbow: 170, lHip: 135, lKnee: 185, rHip: 195, rKnee: 200 },

  stepUp: { hip: [50, 55], torso: 5, lShoulder: 195, lElbow: 195, rShoulder: 165, rElbow: 165, lHip: 120, lKnee: 100, rHip: 195, rKnee: 205 },

  hinge: { hip: [50, 58], torso: 55, lShoulder: 100, lElbow: 190, rShoulder: 260, rElbow: 170, lHip: 195, lKnee: 190, rHip: 165, rKnee: 170 },

  benchPress: { hip: [42, 70], torso: 90, lShoulder: 60, lElbow: 40, rShoulder: 300, rElbow: 320, lHip: 180, lKnee: 130, rHip: 180, rKnee: 230 },

  flyLying: { hip: [42, 70], torso: 90, lShoulder: 95, lElbow: 100, rShoulder: 265, rElbow: 260, lHip: 180, lKnee: 130, rHip: 180, rKnee: 230 },

  flyStanding: { hip: [50, 56], torso: 0, lShoulder: 95, lElbow: 105, rShoulder: 265, rElbow: 255, lHip: 190, lKnee: 190, rHip: 170, rKnee: 170 },

  overheadPress: { hip: [50, 56], torso: 0, lShoulder: 25, lElbow: 15, rShoulder: 335, rElbow: 345, lHip: 190, lKnee: 190, rHip: 170, rKnee: 170 },

  row: { hip: [50, 60], torso: 65, lShoulder: 130, lElbow: 100, rShoulder: 230, rElbow: 260, lHip: 195, lKnee: 190, rHip: 165, rKnee: 170 },

  pulldown: { hip: [50, 58], torso: 0, lShoulder: 35, lElbow: 130, rShoulder: 325, rElbow: 230, lHip: 195, lKnee: 195, rHip: 165, rKnee: 165 },

  pullup: { hip: [50, 46], torso: 0, lShoulder: 30, lElbow: 30, rShoulder: 330, rElbow: 330, lHip: 190, lKnee: 200, rHip: 170, rKnee: 160 },

  hang: { hip: [50, 60], torso: 0, lShoulder: 15, lElbow: 15, rShoulder: 345, rElbow: 345, lHip: 190, lKnee: 190, rHip: 170, rKnee: 170 },

  hangLegRaise: { hip: [50, 58], torso: 0, lShoulder: 15, lElbow: 15, rShoulder: 345, rElbow: 345, lHip: 100, lKnee: 90, rHip: 90, rKnee: 100 },

  dip: { hip: [50, 58], torso: 5, lShoulder: 165, lElbow: 130, rShoulder: 195, rElbow: 230, lHip: 165, lKnee: 110, rHip: 195, rKnee: 250 },

  pushupTop: { hip: [48, 65], torso: 100, lShoulder: 70, lElbow: 60, rShoulder: 290, rElbow: 300, lHip: 190, lKnee: 165, rHip: 190, rKnee: 195 },

  pushupBottom: { hip: [48, 62], torso: 100, lShoulder: 60, lElbow: 150, rShoulder: 300, rElbow: 210, lHip: 190, lKnee: 165, rHip: 190, rKnee: 195 },

  plank: { hip: [48, 62], torso: 100, lShoulder: 70, lElbow: 165, rShoulder: 290, rElbow: 195, lHip: 190, lKnee: 165, rHip: 190, rKnee: 195 },

  situp: { hip: [50, 62], torso: 40, lShoulder: 60, lElbow: 40, rShoulder: 300, rElbow: 320, lHip: 130, lKnee: 100, rHip: 230, rKnee: 260 },

  armIsolation: { hip: [50, 56], torso: 0, lShoulder: 160, lElbow: 60, rShoulder: 200, rElbow: 300, lHip: 190, lKnee: 190, rHip: 170, rKnee: 170 },

  legMachine: { hip: [50, 58], torso: 15, lShoulder: 150, lElbow: 175, rShoulder: 210, rElbow: 185, lHip: 130, lKnee: 105, rHip: 130, rKnee: 105 },

  carry: { hip: [50, 56], torso: 0, lShoulder: 190, lElbow: 190, rShoulder: 170, rElbow: 170, lHip: 145, lKnee: 190, rHip: 205, rKnee: 195 },

  push: { hip: [46, 62], torso: 45, lShoulder: 90, lElbow: 175, rShoulder: 250, rElbow: 195, lHip: 155, lKnee: 190, rHip: 205, rKnee: 175 },

  kettlebell: { hip: [50, 60], torso: 40, lShoulder: 60, lElbow: 45, rShoulder: 300, rElbow: 315, lHip: 195, lKnee: 190, rHip: 165, rKnee: 170 },

  throw: { hip: [48, 60], torso: 45, lShoulder: 150, lElbow: 175, rShoulder: 210, rElbow: 185, lHip: 195, lKnee: 190, rHip: 165, rKnee: 170 },

  jump: { hip: [50, 48], torso: 0, lShoulder: 30, lElbow: 25, rShoulder: 330, rElbow: 335, lHip: 130, lKnee: 70, rHip: 230, rKnee: 290 },

  bagStrike: { hip: [50, 56], torso: 10, lShoulder: 100, lElbow: 90, rShoulder: 220, rElbow: 160, lHip: 200, lKnee: 195, rHip: 155, rKnee: 175 },

  rope: { hip: [50, 55], torso: 0, lShoulder: 15, lElbow: 15, rShoulder: 210, rElbow: 155, lHip: 150, lKnee: 100, rHip: 175, rKnee: 130 },

  battleRopes: { hip: [50, 56], torso: 5, lShoulder: 350, lElbow: 340, rShoulder: 220, rElbow: 250, lHip: 200, lKnee: 195, rHip: 155, rKnee: 175 },

  strongman: { hip: [50, 60], torso: 45, lShoulder: 110, lElbow: 185, rShoulder: 250, rElbow: 175, lHip: 210, lKnee: 190, rHip: 150, rKnee: 175 },

  cardioMachine: { hip: [50, 58], torso: 15, lShoulder: 240, lElbow: 250, rShoulder: 60, rElbow: 20, lHip: 135, lKnee: 80, rHip: 195, rKnee: 200 },

  crawl: { hip: [48, 60], torso: 95, lShoulder: 70, lElbow: 165, rShoulder: 290, rElbow: 195, lHip: 150, lKnee: 90, rHip: 190, rKnee: 195 },

  trx: { hip: [50, 62], torso: 335, lShoulder: 20, lElbow: 10, rShoulder: 340, rElbow: 350, lHip: 195, lKnee: 195, rHip: 165, rKnee: 165 },

  oly: { hip: [50, 62], torso: 10, lShoulder: 100, lElbow: 30, rShoulder: 260, rElbow: 330, lHip: 210, lKnee: 165, rHip: 150, rKnee: 195 },

  balance: { hip: [50, 56], torso: 0, lShoulder: 100, lElbow: 105, rShoulder: 260, rElbow: 255, lHip: 190, lKnee: 190, rHip: 130, rKnee: 60 },

  handstand: { hip: [50, 45], torso: 180, lShoulder: 190, lElbow: 190, rShoulder: 170, rElbow: 170, lHip: 10, lKnee: 15, rHip: 350, rKnee: 345 },

  grip: { hip: [50, 56], torso: 0, lShoulder: 110, lElbow: 40, rShoulder: 250, rElbow: 320, lHip: 190, lKnee: 190, rHip: 170, rKnee: 170 },

  nordic: { hip: [50, 60], torso: 40, lShoulder: 110, lElbow: 175, rShoulder: 250, rElbow: 185, lHip: 175, lKnee: 90, rHip: 185, rKnee: 90 },
}
