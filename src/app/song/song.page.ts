import { Component, OnInit } from '@angular/core';
import {YtServiceService} from '../yt-service.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.page.html',
  styleUrls: ['./song.page.scss'],
})
export class SongPage implements OnInit {

  constructor(private ytService: YtServiceService) { }

  ngOnInit() {
  }

  getVideo(id) {
    this.ytService.openVideo(id);
  }
}
