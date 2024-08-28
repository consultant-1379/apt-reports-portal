export class Appbar {
  constructor(element) {
    this.dom = {
      appbar: element,
      navItem: element.querySelector('.actions-left .item'),
      navToggle: element.querySelector('.actions-left .item .navigation-toggle'),
      menuAnchor: element.querySelector('.actions-left .menu-anchor'),
      title: element.querySelector('.actions-left .title'),
    };
    this.events = {
      toggleNavigation: new CustomEvent('toggleNavigation'),
      showNavigation: new CustomEvent('showNavigation'),
      hideNavigation: new CustomEvent('hideNavigation'),
    };
    this.listeners = {
      toggleNavigation: () => this.toogle(),
      hideNavigation: () => this.hide(),
      showNavigation: () => this.show(),
    };
  }

  init() {
    this.eventHandler();
  }

  destroy() {
    this.removeEventHandler();
  }

  eventHandler() {
    this.dom.navItem.addEventListener(
      'click', this.listeners.toggleNavigation, false);

    this.dom.menuAnchor.addEventListener(
      'click', this.listeners.toggleNavigation, false);

    this.dom.title.addEventListener(
      'click', this.listeners.toggleNavigation, false);

    document.addEventListener('hideNavigation', this.listeners.hideNavigation, false);

    document.addEventListener('showNavigation', this.listeners.showNavigation, false);

    // window.addEventListener('toggleNavigation', this.listeners.toggleNavigation, false);
  }

  removeEventHandler() {
    this.dom.navItem.removeEventListener('click', this.listeners.toggleNavigation, false);
    this.dom.menuAnchor.removeEventListener('click', this.listeners.toggleNavigation, false);
    this.dom.title.removeEventListener('click', this.listeners.toggleNavigation, false);
    document.removeEventListener('hideNavigation', this.listeners.hideNavigation, false);
    document.removeEventListener('showNavigation', this.listeners.showNavigation, false);
  }

  toogle() {
    if (this.dom.title.classList.contains('open-menu')) {
      this.hide();
    } else {
      this.show();
    }
    document.dispatchEvent(this.events.toggleNavigation);
  }

  hide() {
    this.dom.title.classList.remove('open-menu');
    this.dom.menuAnchor.classList.remove('open-menu');
    this.dom.navToggle.classList.remove('closed');
  }

  show() {
    this.dom.title.classList.add('open-menu');
    this.dom.menuAnchor.classList.add('open-menu');
    this.dom.navToggle.classList.add('closed');
  }

}
