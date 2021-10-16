import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Ipost } from "../model/post.model";


@Injectable({
    providedIn: 'root'
})
export class PostService {
    baseUrl: string = "https://ajay-5bf6e-default-rtdb.firebaseio.com/posts";
    constructor(private http: HttpClient) {

    }

    newPost(postData: Ipost): Observable<{ name: string }> {
        let postUrl = `${this.baseUrl}/.json`
        return this.http.post<{ name: string }>(postUrl, postData)
    }

    fetchPosts(): Observable<Ipost[]> {
        let fetchUrl = `${this.baseUrl}/.json`
        return this.http.get<{ [kay: string]: Ipost }>(fetchUrl)
            .pipe(map((resp: any) => {
                console.log(resp)
                let postArray: Ipost[] = [];
                for (let key in resp) {
                    postArray.push({ ...resp[key], id: key })
                }
                return postArray;
            }))
    }

    deletePost(id: string): Observable<any> {
        let deleteUrl = `${this.baseUrl}/${id}/.json`
        return this.http.delete(deleteUrl)
    }
}