import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ModalController} from '@ionic/angular';
import {PlaylistModel} from '../../../playlist/PlaylistModel';

@Component({
  selector: 'app-user-songs-modal',
  templateUrl: './user-songs-modal.component.html',
  styleUrls: ['./user-songs-modal.component.scss'],
})
export class UserSongsModalComponent implements OnInit {
  @Input() playlist: PlaylistModel[];
  @Input() song: string;
  url: SafeResourceUrl = '';
  id = '';
  constructor(private dom: DomSanitizer, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.id = this.song;
    this.url = this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.id);
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  sanitizeVid() {
    return this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.id);
  }
}
