import { Calendar } from './Calendar';

export class Datepicker {

  constructor(element) {
    this.dom = {
      datepicker: element,
      calendar: element.querySelector('.calendar'),
      button: element.querySelector('.btn, .clickable'),
      input: element.querySelector('input[type="text"]'),
      days: undefined,
      hiddenInput: element.querySelector('input[type="hidden"]')
    };
    this.listeners = {
      ifClickedOutside: this.ifClickedOutside.bind(this)
    };

    this.calendar = undefined;
    this.selectedDate = undefined;
  }

  init() {
    this.calendar = new Calendar(this.dom.calendar);
    this.calendar.init();
    this.dom.days = this.dom.calendar.querySelectorAll('td');
    this.eventHandler();
  }

  destroy() {
    document.removeEventListener('click', this.listeners.ifClickedOutside, false);
  }

  eventHandler() {
    this.dom.button.addEventListener('click', () => this.toggleCalendar(), false);
    Array.from(this.dom.days).forEach(day => {
      day.addEventListener('click', (e) => this.selectDay(e), false);
    });
    this.dom.input.addEventListener('click', () => this.toggleCalendar(), false);
    this.dom.input.addEventListener('keyup', (e) => this.listenInput(e), false);
    document.addEventListener('click', this.listeners.ifClickedOutside, false);
  }

  listenInput() {
    let typedInput = this.dom.input.value;
    if (typedInput.length === 10) {
      if (this.isValidDate(typedInput)) {
        this.calendar.setDataCalendar(new Date(typedInput));
        let dateArray = typedInput.split('-');
        this.selectedDate = {
          year: dateArray[0],
          month: dateArray[1],
          day: dateArray[2]
        };
        this.setSelectedDateCSS();
      } else {
        this.invalidDateFormat();
      }
    }
  }

  // set date to today when detecting an invalid date format
  invalidDateFormat() {
    let today = new Date();
    let todayYYYYMMDD = this.calendar.yyyymmdd(today).split('-');
    this.dom.input.value = todayYYYYMMDD.join('-');
    this.selectedDate = {
      year: todayYYYYMMDD[0],
      month: todayYYYYMMDD[1],
      day: todayYYYYMMDD[2]
    };
    this.calendar.setDataCalendar(new Date(today));
    this.calendar.removeAllSelectedDays();
    this.setSelectedDateCSS();
  }

  isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx))
      return false; // Invalid format
    let d;
    if (!((d = new Date(dateString)) | 0))
      return false; // Invalid date (or this could be epoch)
    return d.toISOString().slice(0, 10) === dateString;
  }


  setSelectedDateCSS() {
    this.calendar.removeAllSelectedDays();

    // in case .selectedDate is null, fallback to input value in the dom:
    const selectedDay = this.selectedDate ?
      this.selectedDate.day :
      new Date(this.dom.input.value).getDate() + ''; // convert to string for equality check

    Array.from(this.dom.days).some(day => {
      if (day.innerText === selectedDay) {
        day.classList.add('selected');
        return true;
      }
    });
  }

  selectDay(event) {
    if (!event.target.classList.contains('dummy')) {
      this.calendar.removeAllSelectedDays();
      this.selectedDate = {
        year: this.calendar.calendar.year,
        month: this.calendar.calendar.month,
        day: event.target.innerText
      };
      const formattedDate = this.calendar.formatedDate(this.selectedDate);
      this.dom.input.value = this.dom.hiddenInput.value = formattedDate;
      if (event.target.tagName === 'TD') {
        event.target.classList.add('selected');
      } else {
        event.target.parentNode.classList.add('selected');
      }
      this.dom.input.dispatchEvent(new Event('change'));
      this.hide();
    }
  }

  hide() {
    this.dom.calendar.classList.add('closed');
  }

  show() {
    this.dom.calendar.classList.remove('closed');
  }

  toggleCalendar() {
    if (this.dom.calendar.classList.contains('closed')) {
      this.show();
    } else {
      this.hide();
    }

    const inputValue = this.dom.input.value;
    if (inputValue) { // not empty input
      if (this.isValidDate(inputValue)) {
        this.calendar.setDataCalendar(new Date(inputValue));
        this.setSelectedDateCSS();
      } else {
        this.invalidDateFormat();
      }
    }
  }

  ifClickedOutside(event) {
    if (!this.dom.datepicker.contains(event.target)) {
      this.hide();
    }
  }

}
