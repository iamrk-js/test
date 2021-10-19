import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
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
        let fetchUrl = `${this.baseUrl}/.json`;
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print','pretty');
        searchParams = searchParams.append('authToken','someSecretKey');

        return this.http.get<{ [kay: string]: Ipost }>(fetchUrl, {
            headers: new HttpHeaders({"Custom-header":"Ajay"}),
            params: new HttpParams().set('print','pretty')
        })
            .pipe(map((resp: any) => {
                let postArray: Ipost[] = [];
                for (let key in resp) {
                    postArray.push({ ...resp[key], id: key })
                }
                return postArray;
            }),
            catchError(errorRes => {
                throw new Error(errorRes)
            })
            )
    }

    deletePost(id: string): Observable<any> {
        let deleteUrl = `${this.baseUrl}/${id}/.json`
        return this.http.delete(deleteUrl)
    }
}