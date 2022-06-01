import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators'
import { stringify } from 'querystring';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts= [] ;

  constructor(private http: HttpClient) {}

  ngOnInit() {
      this.fetchPosts();
    // console.log(this.loadedPosts);
  }

  onCreatePost(postData: Post) {
    // Send Http request

    this.http.post<{name: string}>('https://angularhttp-d77bb-default-rtdb.firebaseio.com/posts.json', postData )

      .subscribe( (responseData => {
        console.log(responseData);
      }));
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts()
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts(){
    this.http.get<{[key: string]: Post}>('https://angularhttp-d77bb-default-rtdb.firebaseio.com/posts.json')
    .pipe(map(responseData  => {
      const postArray: Post[] = [];
      for(const key in responseData ){
        if(responseData.hasOwnProperty(key)){
          postArray.push({...responseData[key], id: key});
        }
      }
      return postArray;
    }))
    .subscribe(post => {
      // console.log(post);
     this.loadedPosts = post;
    })
  }
}
