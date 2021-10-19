import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { map } from 'rxjs/operators'
import { Ipost } from './shared/model/post.model';
import { PostService } from './shared/services/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('postForm') postForm !: FormGroup;
  title = 'http2';
  loaderFlag: boolean = false;
  loadedPost: Ipost[] = [];
  loadedPost$!:Observable<Ipost[]>;
  errorFlag:boolean = false;
  errorMsg = new Subject<string>();
  baseUrl: string = "https://ajay-5bf6e-default-rtdb.firebaseio.com/posts.json";

  constructor(private http: HttpClient, private postService: PostService) {

  }
  ngOnInit(): void {
    this.getPosts();
    this.loadedPost$ = this.postService.fetchPosts();
  }
  onCreatePost(postData: Ipost) {
    this.postService.newPost(postData)
      .subscribe((res) => {
        console.log(res);
        this.loadedPost.push(postData);
        this.postForm.reset();
      })
  }

  getPosts() {
    this.loaderFlag = true;
    this.postService.fetchPosts()
      .subscribe((data) => {
        this.loadedPost = data;
        this.loaderFlag = false
      },(error) => {
        console.log(error);
        this.loaderFlag = false;
        this.errorFlag = true;
        this.errorMsg = error?.message;
      } )
  }
  onErrorHandler(){
    this.errorFlag = false;
  }
  onDeletePost(post: Ipost) {
    if (post.id) {
      this.postService.deletePost(post.id)
        .subscribe((res) => {
          this.loadedPost = this.loadedPost.filter((obj:Ipost) => {
            return obj.id !== post.id
          })
        })
    }
  }
}
