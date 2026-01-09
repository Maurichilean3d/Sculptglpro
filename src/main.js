import { Transform } from './transform/transform.js';
import { Orientation } from './transform/orientation.js';

const canvas = document.getElementById('glcanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl');
if (!gl) alert('WebGL no soportado');

const transform = new Transform();
const modeBtn = document.getElementById('modeBtn');

modeBtn.onclick = () => {
  Orientation.toggle();
  modeBtn.textContent = Orientation.mode;
  modeBtn.classList.toggle('active', Orientation.mode === 'LOCAL');
};

// Placeholder render loop
function render() {
  gl.clearColor(0.1, 0.1, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  requestAnimationFrame(render);
}

render();
