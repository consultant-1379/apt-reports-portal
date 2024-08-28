import { WizardSteps } from './scripts/WizardSteps';
import { WizardContent } from './scripts/WizardContent';
import { WizardFooter } from './scripts/WizardFooter';

export class Wizard {
  constructor(element) {
    this.dom = {
      wizard: element,
      steps: element.querySelector('.wizard-steps'),
      content: element.querySelector('.wizard-content'),
      footer: element.querySelector('.wizard-footer'),
    };
    this.steps = {};
    this.content = {};
    this.footer = {};
  }

  init() {
    // wizard footer init
    if (this.dom.footer) {
      this.footer = new WizardFooter(this.dom.footer);
      this.footer.init();
    } else {
      console.error('Wizard footer not found!');
      return;
    }

    // wizard content init
    if (this.dom.content) {
      this.content = new WizardContent(this.dom.content);
      this.content.init();
    } else {
      console.error('Wizard content not found!');
      return;
    }

    // wizard steps init
    if (this.dom.steps) {
      this.steps = new WizardSteps(this.dom.steps);
      this.steps.init();
    } else {
      console.error('Wizard steps not found!');
    }
  }
}
