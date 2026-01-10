import { vec3, mat4 } from '../math/glMatrix.js';

class Gizmo {
  constructor() {
    this._isLocal = false; // GLOBAL por defecto
    this._selected = null;
    this._matrix = mat4.create();
    this._center = vec3.create();

    // ejes globales base
    this._axisGlobal = [
      vec3.fromValues(1, 0, 0),
      vec3.fromValues(0, 1, 0),
      vec3.fromValues(0, 0, 1)
    ];

    // ejes calculados (local o global)
    this._axis = [
      vec3.create(),
      vec3.create(),
      vec3.create()
    ];
  }

  /* ===============================
     ORIENTACIÓN GLOBAL / LOCAL
     =============================== */

  setLocalMode(isLocal) {
    this._isLocal = isLocal;
  }

  isLocalMode() {
    return this._isLocal;
  }

  /* ===============================
     SELECCIÓN DE OBJETO
     =============================== */

  setSelectedMesh(mesh) {
    this._selected = mesh;
    this._updateFromMesh();
  }

  _updateFromMesh() {
    if (!this._selected) return;

    mat4.copy(this._matrix, this._selected.getMatrix());
    this._computeCenter();
    this._computeAxes();
  }

  _computeCenter() {
    vec3.set(
      this._center,
      this._matrix[12],
      this._matrix[13],
      this._matrix[14]
    );
  }

  /* ===============================
     CÁLCULO DE EJES
     =============================== */

  _computeAxes() {
    if (!this._isLocal) {
      // GLOBAL
      vec3.copy(this._axis[0], this._axisGlobal[0]);
      vec3.copy(this._axis[1], this._axisGlobal[1]);
      vec3.copy(this._axis[2], this._axisGlobal[2]);
      return;
    }

    // LOCAL – extraer ejes desde la matriz
    vec3.set(this._axis[0], this._matrix[0], this._matrix[1], this._matrix[2]);
    vec3.set(this._axis[1], this._matrix[4], this._matrix[5], this._matrix[6]);
    vec3.set(this._axis[2], this._matrix[8], this._matrix[9], this._matrix[10]);

    vec3.normalize(this._axis[0], this._axis[0]);
    vec3.normalize(this._axis[1], this._axis[1]);
    vec3.normalize(this._axis[2], this._axis[2]);
  }

  /* ===============================
     TRASLACIÓN
     =============================== */

  translate(axisIndex, amount) {
    if (!this._selected) return;

    const axis = this._axis[axisIndex];
    const delta = vec3.create();
    vec3.scale(delta, axis, amount);

    if (this._isLocal) {
      // local = post-multiplicación
      mat4.translate(this._matrix, this._matrix, delta);
    } else {
      // global = pre-multiplicación
      const t = mat4.create();
      mat4.fromTranslation(t, delta);
      mat4.mul(this._matrix, t, this._matrix);
    }

    this._selected.setMatrix(this._matrix);
  }

  /* ===============================
     ROTACIÓN
     =============================== */

  rotate(axisIndex, angle) {
    if (!this._selected) return;

    const axis = this._axis[axisIndex];

    // mover al origen
    const invCenter = vec3.create();
    vec3.negate(invCenter, this._center);
    mat4.translate(this._matrix, this._matrix, invCenter);

    // rotar
    mat4.rotate(this._matrix, this._matrix, angle, axis);

    // volver al centro
    mat4.translate(this._matrix, this._matrix, this._center);

    this._selected.setMatrix(this._matrix);
  }

  /* ===============================
     ESCALA (LOCAL)
     =============================== */

  scale(axisIndex, amount) {
    if (!this._selected) return;

    const scaleVec = vec3.fromValues(1, 1, 1);
    scaleVec[axisIndex] = amount;

    mat4.translate(this._matrix, this._matrix, vec3.negate(vec3.create(), this._center));
    mat4.scale(this._matrix, this._matrix, scaleVec);
    mat4.translate(this._matrix, this._matrix, this._center);

    this._selected.setMatrix(this._matrix);
  }

  /* ===============================
     UPDATE GENERAL
     =============================== */

  update() {
    if (!this._selected) return;
    this._updateFromMesh();
  }
}

export default Gizmo;
