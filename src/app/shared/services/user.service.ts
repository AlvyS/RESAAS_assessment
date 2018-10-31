import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) { }

  // TODO: Create a user model/interface
  getUsers(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }

  getPosts(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/posts');
  }

}
