export class Pagination {

  constructor(element){
    this.dom = {
      paginationGroup: element,
    };
    this.data = undefined;
    this.events = {
      paginationChangePage: new CustomEvent("paginationChangePage", {
        detail: { state: this.state }
      }),
    }
    this.listeners = {
      setNumEntries: (e) => {
        if(e.detail.value.includes('entries-')){
          this.state.numEntries = this.getNumEntries(e);
          this.updateState();
        }
      }
    };
    this.state = {
      currentPage: 1,
      hasNextPage: true,
      hasPreviousPage: false,
      numEntries: 0,
      numPages: 0,
      pageClicked: 0
    };
  }

  init(nPages){
    this.setNumPages(nPages);
    this.injectPaginationControls();
    this.eventHandler();
  }

  destroy(){
    this.removeEventHandler();
  }

  eventHandler(){
    document.addEventListener('menuItemSelected', e => this.listeners.setNumEntries(e), false);

    const paginationArray = Array.from(this.dom.paginationGroup.querySelectorAll('.pagination li'));
    paginationArray.forEach( (item, i) => {
      item.addEventListener('click', () => {
        this.state.pageClicked = item.dataset.value;
        this.updatePaginationDOM();
        document.dispatchEvent(this.events.paginationChangePage);
      })
    });
  }

  removeEventHandler(){
    // this.dom.someSelector.removeEventListener('click', this.listeners.click, false);
  }

  updatePaginationDOM(){
    this.updateCurrenPage();
    this.setPaginationControls();
  }

  updateCurrenPage(){
    // The arrows have been clicked
    // - Left arrow
    if(this.state.pageClicked.includes('left')){
      if(this.state.currentPage > 1){
        this.state.currentPage--;
      }
    }
    // - Right arrow
    else if(this.state.pageClicked.includes('right')){
      if(this.state.currentPage < this.state.numPages){
        this.state.currentPage++;
      }
    }
    else if(this.state.pageClicked.length !== 0) {
      this.state.currentPage = this.state.pageClicked;
    }

    this.state.hasNextPage = true;
    this.state.hasPreviousPage = true;
    if(this.state.currentPage == 1){
      this.state.hasNextPage = true;
      this.state.hasPreviousPage = false;
    }
    if(this.state.currentPage == this.state.numPages){
      this.state.hasNextPage = false;
      this.state.hasPreviousPage = true;
    }
  }

  setNumPages(nPages){
    this.state.numPages = nPages;
  }

  getNumPages(nRows, nEntries){
    return Math.ceil(nRows/nEntries);
  }

  getNumEntries(event){
    if(event){
      return event.detail.value.split('entries-')[1];
    }else{
      // when method is invoked without event, obtain from dropdown DOM
      const dropdown = this.dom.paginationGroup.querySelector('.right .dropdown');
      const defaultEntries = dropdown.querySelector('.item.highlight');
      return Number.parseInt(defaultEntries.dataset.value.split('entries-')[1]) || 10 ;
    }
  }

  /**
   * Generate pagination controls dynamically
   */
  injectPaginationControls(){
    const pagination = this.dom.paginationGroup.querySelector('.pagination');
    const leftArrow = this.genArrowControl('left', this.state.hasPreviousPage);
    const rightArrow = this.genArrowControl('right', this.state.hasNextPage);
    const nPages = this.state.numPages;

    // Inject Left arrow
    pagination.appendChild(leftArrow);

    // Inject the pages in between
    // - the first pages, ie: 1 2 3 4 5 ... 10
    if(this.state.currentPage < 5){
      for (let i = 1; i < nPages; i++) {
        const control = this.genPageControl(i, this.isCurrentPage(i));
        if(i == 6){
          pagination.appendChild(this.genPageControl('', false));
          pagination.appendChild(this.genPageControl(nPages, this.isCurrentPage(i)));
          break;
        }
        pagination.appendChild(control);
      }
    }

    // the midle pages, ie: 1 ... n-1 n n+1 ... 10
    else if(this.state.currentPage < nPages - 3){
      pagination.appendChild(this.genPageControl('1', false));
      pagination.appendChild(this.genPageControl('', false));
      for (let i = this.state.currentPage - 1; i <= this.state.currentPage + 1; i++) {
        const control = this.genPageControl(i, this.isCurrentPage(i));
        pagination.appendChild(control);
      }
      pagination.appendChild(this.genPageControl('', false));
      pagination.appendChild(this.genPageControl(nPages, false));
    }

    // the last pages, ie: 1 ... 6 7 8 9 10
    else {
      pagination.appendChild(this.genPageControl('1', false));
      pagination.appendChild(this.genPageControl('', false));
      for (let i = nPages - 4; i <= nPages; i++) {
        const control = this.genPageControl(i, this.isCurrentPage(i));
        pagination.appendChild(control);
      }
    }

    // Inject Right arrow
    pagination.appendChild(rightArrow);
  }

  /**
   * Modifies the values of the DOM pages
   */
  setPaginationControls(){
    var currentPage = Number.parseInt(this.state.currentPage);
    var numPages = Number.parseInt(this.state.numPages);
    let paginationArray = [];

    paginationArray.push({label: 'left', state: false});

    if(currentPage < 5){
      for (let i = 1; i < this.state.numPages; i++) {
        if(i == 6){
          paginationArray.push({label: '', state: false});
          paginationArray.push({label: this.state.numPages, state: this.isCurrentPage(i)});
          break;
        }
        paginationArray.push({label: i, state: this.isCurrentPage(i)});
      }
    } else if(currentPage < numPages - 3){
      paginationArray.push({label: '1', state: false});
      paginationArray.push({label: '', state: false});
      for (let i = currentPage - 1; i <= currentPage +1; i++) {
        paginationArray.push({label: i, state: this.isCurrentPage(i)});
      }
      paginationArray.push({label: '', state: false});
      paginationArray.push({label: this.state.numPages, state: false});
    } else {
      paginationArray.push({label: 1, state: false});
      paginationArray.push({label: '', state: false});
      for (let i = numPages - 4; i <= numPages; i++) {
        paginationArray.push({label: i, state: this.isCurrentPage(i)});
      }
    }

    paginationArray.push({label: 'right', state: false});

    const lis = this.dom.paginationGroup.querySelectorAll('.pagination li');
    Array.from(lis).forEach( (item, i) => {
      const label = paginationArray[i].label;
      const state = paginationArray[i].state;
      if(label === 'left'){
        this.setArrowControl(item, 'left', this.state.hasPreviousPage);
      }else if(label === 'right'){
        this.setArrowControl(item, 'right', this.state.hasNextPage);
      } else {
        this.setPageControl(item, label, state);
      }
    });
  }

  genArrowControl(direction, state){
    const li = document.createElement('li');
    const i = document.createElement('i');
    li.classList.add(`${direction}-arrow`);
    if(state){
      li.classList.remove('disabled');
    }else{
      li.classList.add('disabled');
    }
    li.dataset.value = direction;
    i.classList.add('icon', `icon-arrow-${direction}`);
    li.appendChild(i);
    return li;
  }

  genPageControl(label, state){
    const li = document.createElement('li');
    if(state){
      li.classList.add('active');
    }
    li.dataset.value = label;
    li.innerText = label;
    return li;
  }

  setArrowControl(element, direction, state){
    const i = element.querySelector('i');
    element.classList.add(`${direction}-arrow`);
    if(state){
      element.classList.remove('disabled');
    }else{
      element.classList.add('disabled');
    }
    element.dataset.value = direction;
    i.classList.add('icon', `icon-arrow-${direction}`);
  }

  setPageControl(element, label, state){
    if(state){
      element.classList.add('active');
    }else {
      element.classList.remove('active');
    }
    element.dataset.value = label;
    element.innerText = label;
  }

  isCurrentPage(pageNum){
    return Number.parseInt(pageNum) == Number.parseInt(this.state.currentPage);
  }
}
