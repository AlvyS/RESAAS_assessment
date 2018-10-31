import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public users$: any[] = [];
  public posts$: any[] = [];
  public userPosts: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.initData();
  }

  // TODO: Implement using rxjs' forkjoin operator instead of nested subscriptions
  private initData() {
    this.userService.getUsers().subscribe(users => {
      if (users != null) {
        this.users$ = users;

        this.userService.getPosts().subscribe(posts => {
          if (posts != null) {
            this.posts$ = posts;
            this.initUserPosts();
          }
        });

      }
    });
  }

  // Update posts with user information using `userId`
  initUserPosts() {
    this.userPosts = this.posts$.map(post => {
      const userName = this.users$.find(u => u.id === post.userId).name;
      const userEmail = this.users$.find(u => u.id === post.userId).email;
      const userCity = this.users$.find(u => u.id === post.userId).address.city;
      return {
        ...post,
        userName: userName,
        userEmail: userEmail,
        userCity: userCity,
      };
    });
  }

  // Filter to display posts that contain input value
  // Escape special regex characters
  // @ https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
  onFilterPosts(input: string) {
    this.initUserPosts();
    const inputReg = RegExp(`${input.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`);
    this.userPosts = this.userPosts.filter(post => this.doesPostContain(inputReg, post));
  }

  // True or False check to see if posts contain input regex
  doesPostContain(filterValue, post) {
    return (
      filterValue.test(post.userName.toLowerCase())
      || filterValue.test(post.userEmail.toLowerCase())
      || filterValue.test(post.userCity.toLowerCase())
      || filterValue.test(post.title.toLowerCase())
      || filterValue.test(post.body.toLowerCase())
    );
  }

}
