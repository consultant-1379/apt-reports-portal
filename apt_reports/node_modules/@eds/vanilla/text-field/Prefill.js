export class Prefill {

   constructor(element){
     this.dom = {
       prefill: element,
       saved: element.dataset.saved
     };
     this.listeners = {
       blur: (e) => this.checkIfChanged(e)
     };
   }

   init(){
     this.setSavedValue();
     this.eventHandler();
   }

   destroy(){
     this.removeEventHandler();
   }

   eventHandler(){
     this.dom.prefill.addEventListener('blur', this.listeners.blur, false);
   }

   removeEventHandler(){
     this.dom.prefill.removeEventListener('blur', this.listeners.blur, false);
   }

   setSavedValue(){
     this.dom.prefill.value = this.dom.saved;
   }

   checkIfChanged(e){
     if (e.target.value !== this.dom.saved) {
       this.dom.prefill.classList.add('changed');
     } else {
       this.dom.prefill.classList.remove('changed');
     }
   }

 }
