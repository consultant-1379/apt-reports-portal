export class Appnav {
  constructor(element) {
    this.dom = {
      appnav: element,
    };
    this.listeners = {
      toggleNavigation: () => this.toogle(),
      showNavigation: () => this.show(),
      hideNavigation: () => this.hide(),
    };
  }

  init() {
    this.eventHandler();
  }

  destroy() {
    this.removeEventHandler();
  }

  eventHandler() {
    document.addEventListener(
      'toggleNavigation', this.listeners.toggleNavigation, false);

    document.addEventListener(
      'showNavigation', this.listeners.showNavigation, false);

    document.addEventListener(
      'hideNavigation', this.listeners.hideNavigation, false);
  }

  removeEventHandler() {
    document.removeEventListener(
      'toggleNavigation', this.listeners.toggleNavigation, false);

    document.removeEventListener(
      'showNavigation', this.listeners.showNavigation, false);

    document.removeEventListener(
      'hideNavigation', this.listeners.hideNavigation, false);
  }

  toogle() {
    if (this.dom.appnav.classList.contains('hidden')) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    this.dom.appnav.classList.remove('hidden');
  }

  hide() {
    this.dom.appnav.classList.add('hidden');
  }

}
