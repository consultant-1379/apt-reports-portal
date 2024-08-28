export class Slider {

   constructor(element){
     this.dom = {
       slider: element,
       input: element.querySelector('input'),
       valueHolder: element.querySelector('.value'),
     };
     this.listeners = {
       change: () => this.updateValueHolder()
     };
     this.properties = {
       oldValue: this.dom.input.value
     }
   }

   init(){
     this.eventHandler();
   }

   destroy(){
     this.removeEventHandler();
   }

   eventHandler(){
     this.dom.slider.addEventListener('change', this.listeners.change, false);
   }

   removeEventHandler(){
     this.dom.slider.removeEventListener('change', this.listeners.change, false);
   }

   updateValueHolder(){
     if(this.dom.valueHolder.innerHTML){
       this.dom.valueHolder.innerHTML = this.dom.input.value;
     }
   }

 }
