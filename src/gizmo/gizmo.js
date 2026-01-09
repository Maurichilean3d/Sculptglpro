import { Orientation } from '../transform/orientation.js';

export class Gizmo {
  constructor() {
    this.axis = [1, 0, 0];
  }

  getAxis(objectMatrix) {
    if (!Orientation.isLocal()) {
      return this.axis;
    }
    // eje X local desde la matriz
    return [
      objectMatrix[0],
      objectMatrix[1],
      objectMatrix[2]
    ];
  }
}
