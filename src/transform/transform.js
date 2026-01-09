import { Orientation } from './orientation.js';

export class Transform {
  constructor() {
    this.matrix = mat4.create();
  }

  translate(vec) {
    if (Orientation.isLocal()) {
      mat4.translate(this.matrix, this.matrix, vec);
    } else {
      const t = mat4.create();
      mat4.fromTranslation(t, vec);
      mat4.mul(this.matrix, t, this.matrix);
    }
  }

  rotate(angle, axis) {
    if (Orientation.isLocal()) {
      mat4.rotate(this.matrix, this.matrix, angle, axis);
    } else {
      const r = mat4.create();
      mat4.rotate(r, r, angle, axis);
      mat4.mul(this.matrix, r, this.matrix);
    }
  }

  scale(vec) {
    mat4.scale(this.matrix, this.matrix, vec);
  }
}
