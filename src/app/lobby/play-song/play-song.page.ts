import { Component, OnInit } from '@angular/core';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@Component({
  selector: 'app-play-song',
  templateUrl: './play-song.page.html',
  styleUrls: ['./play-song.page.scss'],
})
export class PlaySongPage implements OnInit {

  constructor(private youtube: YoutubeVideoPlayer) { }

  ngOnInit() {
  }
  playVideo(watch) {
    this.youtube.openVideo(watch);
}
}
