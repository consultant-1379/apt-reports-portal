export class Pill {
  constructor(element) {
    this.dom = {
      pill: element
    };
  }

  init() {
    this.eventHandler();
  }

  eventHandler() {
    this.dom.pill.addEventListener('click', () => this.toogleSelection(), false);
  }

  toogleSelection() {
    if (this.dom.pill.classList.contains('selected')) {
      this.setUnSelected();
    } else {
      this.setSelected();
    }
  }

  setSelected() {
    this.dom.pill.classList.add('selected');
  }

  setUnSelected() {
    this.dom.pill.classList.remove('selected');
  }

}
