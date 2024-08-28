export class WizardSteps {

  constructor(element) {
    this.dom = {
      wizard: element,
      arrows: element.querySelectorAll('.arrow'),
      steps: element.querySelectorAll('.step'),
      points: undefined,
      id: element.getAttribute('id')
    };
    this.state = undefined;
    this.scenario = 4;
    this.type = element.dataset.type;
    this.contentTarget = element.dataset.content;
    this.events = {
      wizardState: new CustomEvent('wizardState', {
        detail: {
          message: 'state changed'
        },
        bubbles: true,
        cancelable: true
      })
    };
  }

  init() {
    this.setInitState();    // set wizard initial state object
    this.setInitContext();  // set wizard initial DOM for "navigation" component
    this.updateScenario();  // update scenario variable depending on the window width
    this.eventHandler();    // initialise the event Handler
  }

  eventHandler() {
    let leftArrowDOM = this.dom.wizard.querySelector('.arrow.left');
    let rightArrowDOM = this.dom.wizard.querySelector('.arrow.right');

    rightArrowDOM.addEventListener('click', () => this.showNextSteps(), false);
    leftArrowDOM.addEventListener('click', () => this.showPrevSteps(), false);
    window.addEventListener('resize', () => this.updateScenario(), false);

    // add links to completed steps
    Array.from(this.dom.steps).forEach((step, i) => {
      step.addEventListener('click', () => {
        if (step.classList.contains('completed')) this.go2Step(i);
      }, false);
    });

    document.addEventListener('wizardStateChange', (e) => this.updateState(e), false);
    document.addEventListener('wizardShowNextSteps', () => this.showNextSteps(), false);
    document.addEventListener('wizardShowPrevSteps', () => this.showPrevSteps(), false);
  }

  updateState(event) {
    this.state = event.detail.state;
    this.updateDOM();
  }

  showArrow(arrowDirection) {
    switch (arrowDirection) {
      case 'left':
        this.dom.arrows[0].classList.add('visible');
        break;
      case 'right':
        this.dom.arrows[1].classList.add('visible');
        break;
    }
  }

  hideArrow(arrowDirection) {
    switch (arrowDirection) {
      case 'left':
        this.dom.arrows[0].classList.remove('visible');
        break;
      case 'right':
        this.dom.arrows[1].classList.remove('visible');
        break;
    }
  }

  setInitState() {
    let indexArray = Array.from(this.dom.steps).map((step, i) => i);
    this.state = {
      currentStep: 0,
      refIndex: 0,
      numSteps: this.dom.steps.length,
      allSteps: indexArray,
      presentation: indexArray.slice(0, this.scenario),
      prevSteps: [],
      nextSteps: indexArray.slice(this.scenario, this.dom.steps.length)
    };
    this.events.wizardState.detail.state = this.state; // add state to the event detail
    document.dispatchEvent(this.events.wizardState);
  }

  showNextSteps() {
    this.state.refIndex++;
    let potentialPresentation = this.state.allSteps.slice(this.state.refIndex, this.state.refIndex + this.scenario);
    if (potentialPresentation.length <= this.scenario) this.state.presentation = potentialPresentation;
    this.state.prevSteps = this.state.allSteps.slice(0, this.state.refIndex);
    this.state.nextSteps = this.state.allSteps.slice(this.state.refIndex + this.scenario, this.dom.steps.length);
    this.updateDOM();
  }

  showPrevSteps() {
    this.state.refIndex--;
    this.state.presentation = this.state.allSteps.slice(this.state.refIndex, this.state.refIndex + this.scenario);
    this.state.prevSteps = this.state.allSteps.slice(0, this.state.refIndex);
    this.state.nextSteps = this.state.allSteps.slice(this.state.refIndex + this.scenario, this.dom.steps.length);
    this.updateDOM();
  }

  nextStep() {
    this.state.currentStep++;
    this.updateDOM();
  }

  prevStep() {
    this.state.currentStep--;
    this.updateDOM();
  }

  updateDOM() {
    // keep values within limits
    this.keepRefIndexInBounds();

    // wizard step update
    this.updateDOMCurrentState();

    // wizard visibility
    this.updateDOMArrows();
    this.updateDOMStepsVisibility();

    // wizard navigation
    this.updateDOMContext();

    // dispath change state event
    this.events.wizardState.detail.state = this.state;
    this.dom.wizard.dispatchEvent(this.events.wizardState);
  }

  updateDOMArrows() {
    if (this.state.nextSteps.length > 0) {
      this.showArrow('right');
    } else {
      this.hideArrow('right');
    }
    if (this.state.prevSteps.length > 0) {
      this.showArrow('left');
    } else {
      this.hideArrow('left');
    }
  }

  updateDOMCurrentState() {
    Array.from(this.dom.steps).forEach((step, i) => {
      step.classList.remove('current'); // remove previous "current" states

      if (i < this.state.currentStep) step.classList.add('completed');
      if (i == this.state.currentStep) step.classList.add('current'); // add correct current step
    });
  }

  updateDOMStepsVisibility() {
    Array.from(this.dom.steps).forEach((step, i) => {
      step.classList.add('hidden');
      step.classList.remove('visible');
      if (this.state.presentation.indexOf(i) > -1) {
        step.classList.remove('hidden');
        step.classList.add('visible'); // to impose over the @media style
      }
    });
  }

  updateDOMContext() {
    Array.from(this.dom.points).forEach((point, i) => {

      // update correct "current" point
      point.classList.remove('current'); // remove previous "current" points
      if (i == this.state.currentStep) point.classList.add('current'); // add correct current point

      // update "out-of-context" points
      point.classList.add('out-of-presentation');
      if (this.state.presentation.indexOf(i) > -1) {
        point.classList.remove('out-of-presentation');
      }
    });
  }

  setInitContext() {
    let navigation = document.createElement('div');
    navigation.classList.add('navigation');
    Array.from(this.state.allSteps).forEach((step, i) => {
      let point = document.createElement('div');
      point.classList.add('point');

      // set current
      if (i == 0) point.classList.add('current');

      // set out-of-context if any
      if (this.state.nextSteps.indexOf(i) > -1) {
        point.classList.add('out-of-presentation');
      }

      navigation.appendChild(point);
    });
    this.dom.wizard.appendChild(navigation);
    this.dom.points = this.dom.wizard.querySelectorAll('.point');
  }

  // JS responsive steps
  updateScenario() {
    let width = window.innerWidth;
    switch (true) {
      // case (width >= 1400):
      //   this.scenario = 6;
      //   break;
      // case (width < 1400 && width >= 1200):
      //   this.scenario = 5;
      //   break;
      case (width < 1200 && width >= 1000):
        this.scenario = 4;
        break;
      case (width < 1000 && width >= 700):
        this.scenario = 3;
        break;
      case (width < 700 && width >= 500):
        this.scenario = 2;
        break;
      case (width < 500):
        this.scenario = 1;
        break;
    }
    let potentialPresentation = this.state.allSteps.slice(this.state.refIndex, this.state.refIndex + this.scenario);
    if (potentialPresentation.length <= this.scenario) this.state.presentation = potentialPresentation;
    this.state.nextSteps = this.state.allSteps.slice(this.state.refIndex + this.scenario, this.dom.steps.length);
    this.updateDOM();
  }

  keepRefIndexInBounds() {
    if (this.state.refIndex < 0) {
      this.state.refIndex = 0;
    }
    let refIndexMax = this.state.numSteps - this.scenario;
    if (this.state.refIndex > refIndexMax) {
      this.state.refIndex = refIndexMax;
    }
  }

  go2Step(stepNumber) {
    let diff = this.state.currentStep - stepNumber;
    if (diff > 0) {
      for (var i = 0; i < diff; i++) {
        this.prevStep();
      }
    }
    if (diff < 0) {
      for (var j = 0; j < -diff; j++) {
        this.nextStep();
      }
    }
  }

}
