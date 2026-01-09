export const Orientation = {
  mode: 'GLOBAL',

  toggle() {
    this.mode = this.mode === 'GLOBAL' ? 'LOCAL' : 'GLOBAL';
    console.log('Transform mode:', this.mode);
  },

  isLocal() {
    return this.mode === 'LOCAL';
  }
};
