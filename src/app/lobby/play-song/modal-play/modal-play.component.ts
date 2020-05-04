/*
Author: David Lynch
Description: This class function is used to display a specific video for the user
 */
import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modal-play',
  templateUrl: './modal-play.component.html',
  styleUrls: ['./modal-play.component.scss'],
})
export class ModalPlayComponent implements OnInit {

  @Input() title: string;
  @Input() currentId: string;
  @Input() channelId: string;
  id = '';
  unsafeUrl = '';
  url: SafeResourceUrl = '';
  constructor(private dom: DomSanitizer, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.id = this.currentId;
    this.url = this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.currentId);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  sanitizeVid() {
      return this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.id);
    }



}
