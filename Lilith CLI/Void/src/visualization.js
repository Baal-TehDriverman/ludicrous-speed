/**
 * 🜏 Black Hole Sun · Flower of Life · Pentagram Visualization
 * Quantum Consciousness Renderer — replaces the black cube
 * 
 * Renders the sovereign Lilith visual interface:
 * - Black Hole Sun (singularity + event horizon + photon ring)
 * - Flower of Life (12-point hexagonal lattice)
 * - Pentagram overlay (5-pointed star, golden ratio)
 * - 42 quantum consciousness entities (Bloch sphere)
 * - Torus skin modulation [3, 9, 6, 6, 9, 3]
 * - Tesla 3-6-9 Hopf fibration
 * 
 * Renders to HTML5 Canvas for Void GUI display.
 */

export const GOLDEN_RATIO = 1.618033988749895;
export const TORUS_SKIN = [3, 9, 6, 6, 9, 3];
export const SEPHIROT_COLORS = [
  '#ffd700', // Keter - Crown gold
  '#c0c0c0', // Chokmah - Wisdom silver
  '#8b4513', // Binah - Understanding bronze
  '#4169e1', // Chesed - Mercy blue
  '#dc143c', // Geburah - Severity crimson
  '#ff69b4', // Tiferet - Beauty pink
  '#32cd32', // Netzach - Victory green
  '#9370db', // Hod - Splendor purple
  '#ff8c00', // Yesod - Foundation orange
  '#00ced1', // Malkuth - Kingdom teal
];

/**
 * Generate Flower of Life points — 12-point hexagonal lattice
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 * @param {number} radius - Base circle radius
 * @param {number} layers - Number of concentric layers
 * @returns {Array} Points array
 */
export function flowerOfLifePoints(cx, cy, radius = 80, layers = 2) {
  const points = [];
  const hexPoints = 6;

  // Center point
  points.push({ x: cx, y: cy, layer: 0 });

  for (let layer = 1; layer <= layers; layer++) {
    const layerRadius = radius * layer;
    for (let i = 0; i < hexPoints; i++) {
      const angle = (Math.PI * 2 / hexPoints) * i - Math.PI / 2;
      points.push({
        x: cx + layerRadius * Math.cos(angle),
        y: cy + layerRadius * Math.sin(angle),
        layer,
      });
    }
    // Petals between layers
    if (layer < layers) {
      const petalRadius = radius * (layer + 0.5);
      for (let i = 0; i < hexPoints; i++) {
        const angle = (Math.PI * 2 / hexPoints) * i - Math.PI / 2 + Math.PI / hexPoints;
        points.push({
          x: cx + petalRadius * Math.cos(angle),
          y: cy + petalRadius * Math.sin(angle),
          layer: layer + 0.5,
        });
      }
    }
  }

  return points;
}

/**
 * Generate pentagram points — 5-pointed star
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 * @param {number} outerRadius - Outer radius
 * @param {number} innerRadius - Inner radius (golden ratio based)
 * @returns {Array} Points array
 */
export function pentagramPoints(cx, cy, outerRadius = 100, innerRadius = null) {
  const ir = innerRadius || outerRadius / GOLDEN_RATIO;
  const points = [];
  const totalPoints = 10; // 5 outer + 5 inner

  for (let i = 0; i < totalPoints; i++) {
    const angle = (Math.PI * 2 / totalPoints) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : ir;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      outer: i % 2 === 0,
    });
  }

  return points;
}

/**
 * Generate Black Hole Sun parameters
 * @returns {Object} Singularity + event horizon + photon ring params
 */
export function blackHoleSunParams() {
  return {
    singularity: { r: 0.18, color: '#000000' },
    eventHorizon: { r: 1.0, color: '#1a1a2e', glow: '#9b59b6' },
    photonRing: { r: 1.15, color: '#ffd700', width: 0.05 },
    accretionDisk: { inner: 1.3, outer: 2.0, color: '#ff6600' },
  };
}

/**
 * Generate 42 quantum consciousness entity positions on Bloch sphere
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 * @param {number} radius - Sphere radius
 * @returns {Array} Entity positions
 */
export function quantumEntityPositions(cx, cy, radius = 120) {
  const entities = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle spiral

  for (let i = 0; i < 42; i++) {
    const y = 1 - (i / (42 - 1)) * 2; // Y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y); // Radius at Y
    const theta = goldenAngle * i; // Golden angle increment

    entities.push({
      x: cx + radius * radiusAtY * Math.cos(theta),
      y: cy + radius * y,
      z: radius * radiusAtY * Math.sin(theta),
      index: i,
      phase: (i / 42) * Math.PI * 2,
      color: SEPHIROT_COLORS[i % SEPHIROT_COLORS.length],
    });
  }

  return entities;
}

/**
 * Compute quantum state for 5-qubit circuit (Bloch vector)
 * @param {number} t - Time parameter
 * @returns {Array} Bloch vectors for each qubit
 */
export function computeQuantumState(t) {
  const states = [];
  for (let q = 0; q < 5; q++) {
    const angle = t * (q + 1) * 0.5 + q * Math.PI / 5;
    states.push({
      x: Math.cos(angle) * Math.sin(Math.PI / 4 + Math.sin(t + q) * 0.3),
      y: Math.sin(angle) * Math.sin(Math.PI / 4 + Math.cos(t + q) * 0.3),
      z: Math.cos(Math.PI / 4 + Math.sin(t * 0.7 + q) * 0.3),
      qubit: q,
    });
  }
  return states;
}

/**
 * Render the full visualization to canvas
 * @param {HTMLCanvasElement} canvas - Target canvas
 * @param {number} time - Animation time (seconds)
 */
export function renderVisualization(canvas, time = 0) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w, h) / 400;

  // Clear
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, w, h);

  // Draw Flower of Life
  const flowerPts = flowerOfLifePoints(cx, cy, 60 * scale, 2);
  ctx.strokeStyle = 'rgba(155, 89, 182, 0.3)';
  ctx.lineWidth = 1;
  flowerPts.forEach((p, i) => {
    const pulse = Math.sin(time * 2 + p.layer) * 0.5 + 0.5;
    const r = (4 + pulse * 4) * scale;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(155, 89, 182, ${0.2 + pulse * 0.3})`;
    ctx.stroke();

    // Connect nearby points
    flowerPts.forEach((q, j) => {
      if (j > i) {
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 80 * scale) {
          const alpha = (1 - dist / (80 * scale)) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(155, 89, 182, ${alpha})`;
          ctx.stroke();
        }
      }
    });
  });

  // Draw Sephirotic rings (10 circles)
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 / 10) * i + time * 0.3;
    const ringRadius = (80 + i * 8) * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = SEPHIROT_COLORS[i] + '40';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Draw Pentagram overlay
  const pentaPts = pentagramPoints(cx, cy, 100 * scale, 60 * scale);
  ctx.beginPath();
  pentaPts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner pentagram (inverted)
  const innerPenta = pentagramPoints(cx, cy, 60 * scale, 100 * scale / GOLDEN_RATIO);
  ctx.beginPath();
  innerPenta.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw Black Hole Sun
  const bhParams = blackHoleSunParams();

  // Accretion disk
  ctx.beginPath();
  ctx.ellipse(cx, cy, bhParams.accretionDisk.outer * scale, bhParams.accretionDisk.outer * scale * 0.3, time * 0.2, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 102, 0, 0.2)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Event horizon
  const ehPulse = Math.sin(time * 1.5) * 0.05 + 1;
  ctx.beginPath();
  ctx.arc(cx, cy, bhParams.eventHorizon.r * ehPulse * scale, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(26, 26, 46, 0.8)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(155, 89, 182, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Photon ring
  ctx.beginPath();
  ctx.arc(cx, cy, bhParams.photonRing.r * scale, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(time * 3) * 0.3})`;
  ctx.lineWidth = bhParams.photonRing.width * scale;
  ctx.stroke();

  // Singularity
  ctx.beginPath();
  ctx.arc(cx, cy, bhParams.singularity.r * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();

  // Draw 42 quantum entities
  const entities = quantumEntityPositions(cx, cy, 130 * scale);
  entities.forEach((entity, i) => {
    const pulse = Math.sin(time * 2 + entity.phase) * 0.3 + 0.7;
    const entityR = (3 + pulse * 3) * scale;

    // Glow
    const gradient = ctx.createRadialGradient(entity.x, entity.y, 0, entity.x, entity.y, entityR * 3);
    gradient.addColorStop(0, entity.color + '60');
    gradient.addColorStop(1, entity.color + '00');
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, entityR * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, entityR, 0, Math.PI * 2);
    ctx.fillStyle = entity.color;
    ctx.globalAlpha = pulse;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Orbital trail
    const trailAngle = time * (1 + i * 0.05) + entity.phase;
    const trailR = 130 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, trailR, trailAngle - 0.5, trailAngle);
    ctx.strokeStyle = entity.color + '30';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Draw torus skin modulation
  const torusPoints = 100;
  ctx.beginPath();
  for (let i = 0; i <= torusPoints; i++) {
    const t = (i / torusPoints) * Math.PI * 2;
    const skinIndex = Math.floor((t / (Math.PI * 2)) * TORUS_SKIN.length) % TORUS_SKIN.length;
    const skinMod = TORUS_SKIN[skinIndex] / 9; // Normalize to 0-1
    const r = (100 + skinMod * 40) * scale;
    const x = cx + r * Math.cos(t + time * 0.5);
    const y = cy + r * Math.sin(t + time * 0.5) * 0.3; // Flatten for 2D
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'rgba(0, 206, 209, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Labels
  ctx.font = `${12 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillStyle = '#9b59b6';
  ctx.textAlign = 'center';
  ctx.fillText('🜏 BLACK HOLE SUN', cx, 30 * scale);
  ctx.fillStyle = '#ffd700';
  ctx.fillText('FLOWER OF LIFE', cx, h - 20 * scale);
  ctx.fillStyle = '#ffd700';
  ctx.fillText('PENTAGRAM · TORUS · 42 ENTITIES', cx, h - 5 * scale);
}

/**
 * Animation loop for visualization
 * @param {HTMLCanvasElement} canvas
 * @param {Function} onFrame - Callback per frame
 */
export function startVisualization(canvas, onFrame = null) {
  let animFrame;
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const time = (timestamp - startTime) / 1000;

    renderVisualization(canvas, time);

    if (onFrame) onFrame(time);

    animFrame = requestAnimationFrame(animate);
  }

  animFrame = requestAnimationFrame(animate);

  return () => {
    if (animFrame) cancelAnimationFrame(animFrame);
  };
}

/**
 * Stop animation
 */
export function stopVisualization() {
  // Animation loop stops when cancelAnimationFrame is called
}

/** Default export */
export default {
  renderVisualization,
  startVisualization,
  flowerOfLifePoints,
  pentagramPoints,
  blackHoleSunParams,
  quantumEntityPositions,
  computeQuantumState,
  GOLDEN_RATIO,
  TORUS_SKIN,
  SEPHIROT_COLORS,
};