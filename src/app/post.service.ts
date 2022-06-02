import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  ceateAndStorePost(title: string, content: string) {

    const postData: Post = { title: title, content: content };
    this.http.post<{ name: string }>('https://angularhttp-d77bb-default-rtdb.firebaseio.com/posts.json', postData,
      {
        observe: 'response'
      }
    )
      .subscribe((responseData => {
        console.log(responseData);
      }), error => {
        this.error.next(error.message);
      });
  }

  fetchPost() {

    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');

    return this.http.get<{ [key: string]: Post }>('https://angularhttp-d77bb-default-rtdb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({ 'Custom-headers': 'hello' }),
        params: searchParams
        // responseType: 'text' //not valid has to be same type return
        , responseType: 'json'
      }
    )
      .pipe(map(responseData => {
        const postArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({ ...responseData[key], id: key });
          }
        }
        return postArray;
      }),
        catchError(errorRes => {
          return throwError(errorRes)
        })
      );
    // .subscribe(post => {/
    // console.log(post);
    //   this.isFetching=false;
    //  this.loadedPosts = post;
    // })

  }

  deleteAllPost() {
    return this.http.delete('https://angularhttp-d77bb-default-rtdb.firebaseio.com/posts.json',
      {
        observe: 'events',
        responseType: 'text'
      }
    ).pipe(tap(event => {
      console.log(event);
      if (event.type === HttpEventType.Sent) {

      }
      if (event.type === HttpEventType.Response) {
        console.log(event.body)

      }
    }));
    // console.log('all Post Deleted');
  }
}
