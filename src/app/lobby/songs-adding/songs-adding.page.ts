import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-songs-adding',
  templateUrl: './songs-adding.page.html',
  styleUrls: ['./songs-adding.page.scss'],
})
export class SongsAddingPage implements OnInit {
  songName: string;
  songId: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.songName = params.songName;
      this.songId = params.songId;
    });
  }

}
