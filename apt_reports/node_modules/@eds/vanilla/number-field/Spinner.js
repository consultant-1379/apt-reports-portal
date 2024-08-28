export class Spinner {
  constructor(element) {
    this.dom = {
      spinner: element,
      controls: element.querySelectorAll('.controls > .icon'),
      max: element.querySelector('input').getAttribute('max') || Number.MAX_VALUE,
      min: element.querySelector('input').getAttribute('min') || -Number.MAX_VALUE,
      step: element.querySelector('input').getAttribute('step') || 1,
      input: element.querySelector('input')
    };
    this.type = element.dataset.type;
    this.zeroLeading = element.dataset.zeroLeading;
    this.events = {
      changeTimerValue: new CustomEvent('changeTimerValue', {
        detail: {
          message: 'value changed'
        },
        bubbles: true,
        cancelable: true
      })
    };
  }

  init() {
    if (this.type !== 'text') this.setCorrectState();
    this.eventHandler();
  }

  eventHandler() {
    switch (this.type) {
      case 'text':
        this.dom.controls[0].addEventListener('click', () => this.toggleTimeMode(), false);
        break;
      default:
        this.dom.controls[1].addEventListener('click', () => this.increaseValue(), false);
        this.dom.controls[0].addEventListener('click', () => this.decreaseValue(), false);
        this.dom.input.addEventListener('change', (e) => this.addLeadingZero(e), false);
        this.dom.input.addEventListener('keyup', () => this.setCorrectFormat(), false);
    }

  }

  addLeadingZero(event) {
    this.setCorrectFormat();
    if (event.target.value < 10) {
      event.target.value = this.leadingZero(event.target.value);
    }
    this.setCorrectState();
  }

  toggleTimeMode() {
    let input = this.dom.spinner.querySelector('input');
    if (input.value === 'AM') {
      input.value = 'PM';
    } else {
      input.value = 'AM';
    }
    this.dom.spinner.dispatchEvent(this.events.changeTimerValue);
  }

  setCorrectState() {
    let input = this.dom.spinner.querySelector('input');

    this.dom.controls[0].classList.remove('disabled');
    this.dom.controls[1].classList.remove('disabled');

    if (parseInt(input.value) === this.dom.max) {
      this.dom.controls[1].classList.add('disabled');
    }

    if (parseInt(input.value) === this.dom.min) {
      this.dom.controls[0].classList.add('disabled');
    }
  }

  setCorrectFormat() {
    let input = this.dom.spinner.querySelector('input');

    if (!isNaN(parseInt(input.value))) {
      if (parseInt(input.value) > this.dom.max) {
        input.value = this.dom.max;
      }
      if (parseInt(input.value) < this.dom.min) {
        input.value = this.dom.min;
      }
    } else {
      // not a number
      input.value = this.dom.min;
    }

  }

  increaseValue() {
    let input = this.dom.spinner.querySelector('input');
    if (parseInt(input.value) < this.dom.max) {
      input.value = this.leadingZero(parseInt(input.value) + parseInt(this.dom.step));
    }
    this.setCorrectState();
    this.dom.spinner.dispatchEvent(this.events.changeTimerValue);
  }

  decreaseValue() {
    let input = this.dom.spinner.querySelector('input');
    if (parseInt(input.value) > this.dom.min) {
      input.value = this.leadingZero(parseInt(input.value) - parseInt(this.dom.step));
    }
    this.setCorrectState();
    this.dom.spinner.dispatchEvent(this.events.changeTimerValue);
  }

  leadingZero(number) {
    let n = parseInt(number),
      result = n;
    if (n < 10 && this.zeroLeading) result = '0' + n;
    return result;
  }

}
