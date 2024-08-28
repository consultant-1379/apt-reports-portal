export class Tree {
  static toggleAccordion(title) {
    title.classList.toggle('opened');
  }

  constructor(element) {
    this.dom = {
      accordion: element,
      titles: element.querySelectorAll('.title'),
    };
  }

  init() {
    this.eventHandler();
  }

  eventHandler() {
    Array.from(this.dom.titles).forEach((title) => {
      title.addEventListener('click', () => Tree.toggleAccordion(title), false);
    });
  }
}
