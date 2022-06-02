import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from './post.model';
import { PostService } from './post.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts= [] ;
  isFetching = false;
  error = null;
  private errorSub :Subscription;

  constructor(private postService: PostService) {}
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  ngOnInit() {
    this.onFetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.ceateAndStorePost(postData.title, postData.content);

  }

  onFetchPosts() {
    // Send Http request
    this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.error =errorMessage;
    });

    this.isFetching = true;
    this.postService.fetchPost()
      .subscribe(post => {
        this.isFetching=false;
        this.loadedPosts =post;
      }, error => {
        this.isFetching = false;
        this.error =error.message;
        console.log(error);

      });
  }

  onClearPosts() {
    this.postService.deleteAllPost().subscribe(() => {
      // this.loadedPosts = [];
      this.onFetchPosts();

    });
    // this.onFetchPosts();
  }

  onHandleError(){
    this.error = null;
  }


}
