import { Component, OnInit } from '@angular/core';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import {SongModel} from '../song.model';
import {NgForm} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-play-song',
  templateUrl: './play-song.page.html',
  styleUrls: ['./play-song.page.scss'],
})
export class PlaySongPage implements OnInit {
  songs: SongModel[];
  vid = 'https://www.youtube.com/embed/zIE8aSw40eY';
  constructor(private youtube: YoutubeVideoPlayer, private dom: DomSanitizer) { }

  ngOnInit() {
  }
  sanitizeVid(vid) {
    return this.dom.bypassSecurityTrustResourceUrl(vid);
  }
  playVideo(watch) {
    this.youtube.openVideo(watch);
}
  addSong(id) {
    // this.songs.push(new SongModel('song1', id));
  }
  onSubmit(form: NgForm) {
    const name = form.value.name;

  }
}


