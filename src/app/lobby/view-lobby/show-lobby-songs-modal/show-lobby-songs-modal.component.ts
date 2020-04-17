import {Component, Input, OnInit} from '@angular/core';
import {SongModel} from '../../song.model';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-show-lobby-songs-modal',
  templateUrl: './show-lobby-songs-modal.component.html',
  styleUrls: ['./show-lobby-songs-modal.component.scss'],
})
export class ShowLobbySongsModalComponent implements OnInit {
  @Input() songs: SongModel[];
  constructor(private  modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }


}
