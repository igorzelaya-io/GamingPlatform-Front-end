import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user/user';
import {retry, catchError } from 'rxjs/operators';
import { ImageModel } from '../models/imagemodel';


const USER_API = 'http://localhost:8080/userapi/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {

  }

  searchOption = [];
  public userData: User[];
  
  private handleError<T>(operation = 'operation', result ?: T){
    return(error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of (result as T);
    };
  }

  private log(message: string): void{
    console.log(message);
  }
  
  public getUserByUserName(userName: string): Observable<User>{
    return this.httpClient.get<User>(USER_API + '/search/userName=' + userName).pipe(
        retry(1), catchError(this.handleError<User>('getUserByUserName', {} as User))
    );
  }

  public getUserById(userId: string): Observable<User>{
     return this.httpClient.get<User>(USER_API + '/search/userId=' + userId).pipe(
         retry(1), catchError(this.handleError<User>('getUserById', {} as User))
     );
  }

  public getAllUsers(): Observable<User[]>{
    return this.httpClient.get<User[]>(USER_API)
    .pipe(catchError(this.handleError('getAllUsers', [])));
  }

  public updateUser(user: User): Observable<string>{
      return this.httpClient.put<string>(USER_API + '/update' + user, user);
  }

  public updateUserField(userId: string, userField: string, replaceValue:string ): Observable<string>{
    return this.httpClient.put<string>(USER_API + 'update?userId=' + userId
                                        + '?userField='+ userField
                                        + '?replaceValue=' + replaceValue, replaceValue);
  }

  public deleteUser(userId: string):Observable<string>{
    return this.httpClient.delete<string>(USER_API + '/delete?userId=' + userId);
  }

  public deleteUserField(userId: string, userField: string): Observable<string>{
    return this.httpClient.delete<string>(USER_API + '/delete?userId=' + userId
                                          + '?userField=' + userField);
  }

  public addImageToUser(user: User, imageModel: ImageModel): Observable<void>{
    const formData: FormData = new FormData();
    formData.append('image', imageModel.imageFile, imageModel.imageName);
    user.userImage = formData;
    return;
  }

  filteredListOptions(): User[]{
    let users = this.userData;
    let filteredUsersList = [];
    for (let user of users){
      for (let option of this.searchOption){
        if (option.userName === user.userName){
          filteredUsersList.push(user);
        }
      }
    }
    console.log(filteredUsersList);
    return filteredUsersList;
  }


}