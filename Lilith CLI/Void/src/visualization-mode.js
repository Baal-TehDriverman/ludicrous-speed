import { renderVisualization, startVisualization } from './visualization.js';

// ─── Visualization Mode for Lilith CLI ───
// Renders the Black Hole Sun / Flower of Life / Pentagram to canvas
// Accessible via: lilith void visualization

export function initVisualization(canvasId = 'void-visualization') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error('Void visualization: canvas not found');
    return null;
  }

  // Set canvas size
  canvas.width = canvas.clientWidth || 1280;
  canvas.height = canvas.clientHeight || 1280;

  // Start animation
  const stop = startVisualization(canvas);

  console.log('🜏 Void visualization started on', canvasId);
  console.log('   Call stopVisualization() to stop');

  return stop;
}

export function stopVisualization() {
  if (window._void_anim_frame) {
    cancelAnimationFrame(window._void_anim_frame);
    window._void_anim_frame = null;
  }
  console.log('🜏 Void visualization stopped');
}

// Auto-start if canvas exists
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('void-visualization');
  if (canvas) {
    canvas.width = canvas.clientWidth || 1280;
    canvas.height = canvas.clientHeight || 1280;
    const stop = startVisualization(canvas);
    window._void_anim_stop = stop;
  }
});

export default { initVisualization, stopVisualization, renderVisualization };