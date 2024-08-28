export class Tab {
  constructor(json){
    this.dom = {
      title: json.title,
      content: json.content
    }
  }

  showContent(){
    this.dom.title.classList.add('selected');
    this.dom.content.classList.add('selected');
  }

  hideContent(){
    this.dom.title.classList.remove('selected');
    this.dom.content.classList.remove('selected');
  }
}
