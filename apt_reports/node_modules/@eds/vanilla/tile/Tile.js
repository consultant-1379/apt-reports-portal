export class Tile {
  constructor(element) {
    this.dom = {
      tile: element,
      header: element.querySelector('.header'),
      actions: element.querySelectorAll('.header .action'),
      id: element.id
    };

    this.events = {
      maximizeTile: new CustomEvent('maximizeTile', {
        detail: {
          id: this.dom.id,
          message: 'tile maximized'
        },
        bubbles: false,
        cancelable: true
      }),
      minimizeTile: new CustomEvent('minimizeTile', {
        detail: {
          id: this.dom.id,
          message: 'tile minimize'
        },
        bubbles: true,
        cancelable: true
      })
    };
  }

  init() {
    this.eventHandler();
  }

  eventHandler() {
    const actions = this.dom.actions;
    if (actions) {
      Array.from(actions).forEach(action => {
        switch (action.dataset.type) {
          case 'maximize':
            action.addEventListener('click', () => this.toggleFullScreen(action), false);
            break;
          default:
        }
      });
    }
    this.dom.tile.addEventListener('maximizeTile', (e) => this.hideNotSelf(e), false);
    this.dom.tile.addEventListener('minimizeTile', () => this.show(), false);
  }

  toggleFullScreen(action) {
    if (this.dom.tile.classList.contains('fullscreen')) {
      this.minimize(action);
    } else {
      this.maximize(action);
    }
  }

  maximize(action) {
    this.setTooltipMessage(action, 'Minimize tile');
    this.dom.tile.classList.add('fullscreen');
    const icon = action.querySelector('.icon');
    icon.classList.add('icon-minimize');
    icon.classList.remove('icon-maximize');
    window.document.dispatchEvent(this.events.maximizeTile);
  }

  minimize(action) {
    this.setTooltipMessage(action, 'Maximize tile');
    this.dom.tile.classList.remove('fullscreen');
    const icon = action.querySelector('.icon');
    icon.classList.remove('icon-minimize');
    icon.classList.add('icon-maximize');
    window.document.dispatchEvent(this.events.minimizeTile);
  }

  setTooltipMessage(action, message) {
    action.querySelector('.tooltip .message').innerText = message;
  }

  hide() {
    this.dom.tile.classList.add('hidden');
  }

  show() {
    this.dom.tile.classList.remove('hidden');
  }

  hideNotSelf(event) {
    if (event.detail.id !== this.dom.id) {
      this.dom.hide();
    }
  }

  destroy() {
    //
  }

}
