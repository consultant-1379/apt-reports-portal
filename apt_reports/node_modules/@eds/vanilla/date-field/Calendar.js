export class Calendar {

  constructor(element) {
    this.dom = {
      calendar: element,
      year: element.querySelector('.year'),
      month: element.querySelector('.month'),
      days: undefined, // filled in after creation; see createCalendarBody()
      prevYear: element.querySelector('.head i:nth-child(4)'),
      prevMonth: element.querySelector('.head i:nth-child(1)'),
      nextMonth: element.querySelector('.head i:nth-child(3)'),
      nextYear: element.querySelector('.head i:nth-child(6)'),
      body: element.querySelector('table.body'),
    };
    this.eng = {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    };
    this.calendar = {
      year: '',
      month: '',
      days: []
    };
  }

  init() {
    this.createCalendarBody(); // Creates the HMLT calendar body template
    this.setDataCalendar(new Date()); // sets this.calendar values and updated the DOM values too
    this.eventHandler(); // Creates event listeners for different interactions
  }

  eventHandler() {
    this.dom.prevYear.addEventListener('click', () => this.prevYear(), false);
    this.dom.prevMonth.addEventListener('click', () => this.prevMonth(), false);
    this.dom.nextMonth.addEventListener('click', () => this.nextMonth(), false);
    this.dom.nextYear.addEventListener('click', () => this.nextYear(), false);
  }

  prevYear() {
    let modifiedDate = this.formatedDate({
      year: parseInt(this.calendar.year) - 1,
      month: this.calendar.month,
      day: '1' // the exact day is not relevant
    }); // YYYY-MM-DD format
    this.setDataCalendar(new Date(modifiedDate));
    this.removeAllSelectedDays();
  }

  prevMonth() {
    let year = this.calendar.year;
    let monthNum = this.eng.months.indexOf(this.calendar.month);

    // decrement month
    if (monthNum === 0) {
      monthNum = 11;
      year = parseInt(this.calendar.year) - 1;
    } else {
      monthNum--;
    }

    let modifiedDate = this.formatedDate({
      year: year,
      month: this.eng.months[monthNum],
      day: '1' // the exact day is not relevant
    }); // YYYY-MM-DD format
    this.setDataCalendar(new Date(modifiedDate));
    this.removeAllSelectedDays();
  }

  nextMonth() {
    let year = this.calendar.year;
    let monthNum = this.eng.months.indexOf(this.calendar.month);

    // increment month
    if (monthNum === 11) {
      monthNum = 0;
      year = parseInt(this.calendar.year) + 1;
    } else {
      monthNum++;
    }

    let modifiedDate = this.formatedDate({
      year: year,
      month: this.eng.months[monthNum],
      day: '1' // the exact day is not relevant
    }); // YYYY-MM-DD format
    this.setDataCalendar(new Date(modifiedDate));
    this.removeAllSelectedDays();
  }

  nextYear() {
    let modifiedDate = this.formatedDate({
      year: parseInt(this.calendar.year) + 1,
      month: this.calendar.month,
      day: '1' // the exact day is not relevant
    }); // YYYY-MM-DD format
    this.setDataCalendar(new Date(modifiedDate));
    this.removeAllSelectedDays();
  }

  // Creates the necessary tr and td elements.
  createCalendarBody() {
    // tabel head
    let thead = document.createElement('thead'),
      trHead = document.createElement('tr'),
      d = 0;
    for (; d < 7; d++) {
      let th = document.createElement('th');
      th.innerHTML = this.eng.days[d];
      trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    this.dom.body.appendChild(thead);

    // table body
    let tbody = document.createElement('tbody'),
      numTD = 7, // 7 days / week
      numTR = 6, // 6 weeks / month
      j = 0;
    for (; j < numTR; j++) {
      let tr = document.createElement('tr');
      for (let i = 0; i < numTD; i++) {
        let td = document.createElement('td');
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    this.dom.body.appendChild(tbody);

    // update the constructor value 'days'
    this.dom.days = this.dom.calendar.querySelectorAll('td');
  }

  // fills in the DOM content with this.calendar information
  setDOMCalendar() {
    let today = this.yyyymmdd(new Date()).split('-');
    this.dom.month.innerText = this.calendar.month;
    this.dom.year.innerText = this.calendar.year;
    Array.from(this.dom.days).forEach((dayDOM, i) => {
      let dayValue = this.calendar.days[i];
      if (dayValue !== 0) {
        dayDOM.innerText = dayValue;
        dayDOM.classList.remove('dummy');
        if (today[0] === this.calendar.year &&
          today[1] === this.eng.months.indexOf(this.calendar.month) + 1 &&
          today[2] === this.calendar.days[i]) {
          dayDOM.innerHTML = '<span class="today">' + dayValue + '</span>';
        }
      } else {
        dayDOM.innerText = '';
        dayDOM.classList.add('dummy');
      }
    });
  }

  setDataCalendar(date) {
    let darray = this.yyyymmdd(date).split('-');
    let jsDate = new Date(darray[0], darray[1] - 1, 1),
      lastDayMonth = new Date(darray[0], darray[1], 0),
      daysInMonthNum = lastDayMonth.getDate(),
      dayOfWeekNum = jsDate.getUTCDay(),
      lastDayOfWeekNum = lastDayMonth.getUTCDay();
    this.calendar.year = darray[0];
    this.calendar.month = this.eng.months[darray[1] - 1];

    // create 0's at the head
    let headZeroes = Array.apply(null, {
      length: dayOfWeekNum
    }).map(Number.prototype.valueOf, 0);

    // create day numbers != 0
    let numbersInRow = Array.apply(null, {
      length: daysInMonthNum + 1
    }).map(Number.call, Number);
    numbersInRow.shift();

    // create 0's at the tail
    let numZeroes = 42 - (headZeroes.length + numbersInRow.length);
    let tailZeroes = Array.apply(null, Array(numZeroes)).map(Number.prototype.valueOf, 0);

    // concat all the days and add to calendar
    this.calendar.days = headZeroes.concat(numbersInRow, tailZeroes);

    // Updates the values of the DOM with the current calendar data
    this.setDOMCalendar();
  }

  // given a js Date Object return a string in YYYY-MM-DD format
  yyyymmdd(jsDate) {
    let mm = jsDate.getMonth() + 1;
    let dd = jsDate.getDate();
    return [jsDate.getFullYear(),
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd
    ].join('-');
  }

  formatedDate(date) {
    return (
      date.year + '-' +
      this.getMonthNum(date.month) + '-' +
      this.getDayNum(date.day)
    );
  }

  getMonthNum(month) {
    var n = this.eng.months.indexOf(month) + 1;
    return n < 10 ? '0' + n : n;
  }

  getDayNum(day) {
    return day < 10 ? '0' + day : day;
  }

  removeAllSelectedDays() {
    Array.from(this.dom.days).forEach(function(day) {
      day.classList.remove('selected');
    });
  }

}
