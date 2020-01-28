import { Injectable } from '@angular/core';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class YtServiceService {

  constructor(private youtube: YoutubeVideoPlayer, private http: HttpClient) { }
  apiKey = 'AIzaSyCUCNFVR7rKpYcQtMYvmn4T3FI2pWHmUBQ';
  openVideo(id) {
    this.youtube.openVideo(id);
  }

}
