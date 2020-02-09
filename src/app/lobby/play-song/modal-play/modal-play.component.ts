import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-modal-play',
  templateUrl: './modal-play.component.html',
  styleUrls: ['./modal-play.component.scss'],
})
export class ModalPlayComponent implements OnInit {

  @Input() title: string;
  @Input() currentVidID: string;
  url: SafeResourceUrl = ''
  constructor(private dom: DomSanitizer) { }

  ngOnInit() {}
    sanitizeVid(vidId) {
      return this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + vidId);
    }



}
