import { Injectable } from '@angular/core';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@Injectable({
  providedIn: 'root'
})
export class YtServiceService {

  constructor(private youtube: YoutubeVideoPlayer) { }

  openVideo(id) {
    this.youtube.openVideo(id);
  }
}
