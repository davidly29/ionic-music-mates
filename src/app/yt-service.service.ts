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
  // this function gets the categories from the youTube rest api.
  getCategories() {
    // tslint:disable-next-line:max-line-length
    return this.http.get('https://www.googleapis.com/youtube/v3/videoCategories?order=viewCount&part=snippet&regionCode=US&key=' + this.apiKey);
  }
// this function gets videos from the specified category from the youtube rest api
  getVideos(category) {
    // tslint:disable-next-line:max-line-length
    return this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=' + category + '&key=' + this.apiKey);

  }

    SearchVideo(searchKey: string) {

        return  this.http.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: 'AIzaSyCUCNFVR7rKpYcQtMYvmn4T3FI2pWHmUBQ',
                type: 'video',
                maxResults: '50',
                part: 'id,snippet',
                fields: 'items/id,items/snippet/title, items/snippet/description,items/snippet/thumbnails/default',
                q: searchKey
            }
        });
  }


}
