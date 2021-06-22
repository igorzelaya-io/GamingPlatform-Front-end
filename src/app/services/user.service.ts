import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user/user';
import {retry, catchError } from 'rxjs/operators';
import { ImageModel } from '../models/imagemodel';
import { MessageResponse } from '../models/messageresponse';
import { UserTokenRequest } from '../models/usertokenrequest';
import { D1Transaction } from '../models/d1transaction';
import { JwtResponse } from '../models/jwtresponse';

const USER_API = '/userapi';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {

  }

  searchOption: User[] = [];

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
    return this.httpClient.get<User>(USER_API + '/users/search?userName=' + userName).pipe(
        retry(1), catchError(this.handleError<User>('getUserByUserName', {} as User))
    );
  }

  public getUserById(userId: string): Observable<User>{
      return this.httpClient.get<User>(USER_API + '/users/search?userId=' + userId).pipe(
        retry(1), catchError(this.handleError<User>('getUserById', {} as User))
    );
  }

  public getAllUsers(): Observable<User[]>{
    return this.httpClient.get<User[]>(USER_API + '/users')
    .pipe(catchError(this.handleError('getAllUsers', [])));
  }

  public getAllUserTransactions(userId: string, jwtToken: string): Observable<D1Transaction[]>{
    return this.httpClient.get<D1Transaction[]>(USER_API + '/users/transactions?userId=' + userId,
    {headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(
      retry(1),
      catchError(this.handleError('getAllUserTransactions', []))
    );
  }

  public getUserTransaction(userId: string, transactionId: string): Observable<D1Transaction>{
    return this.httpClient.get<D1Transaction>(USER_API + '/users/transactions?userId=' + userId + '&transactionId=' + transactionId,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + JwtResponse})})
      .pipe(
        retry(1),
        catchError(this.handleError('getUserTransaction', {} as D1Transaction))
      );
  }

  public updateUser(user: User, jwtToken: string): Observable<MessageResponse>{
      return this.httpClient.put<MessageResponse>(USER_API + '/users/update', user,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
      .pipe(catchError(this.handleError('updateUserTokens', {} as MessageResponse)));
  }

  public updateUserField(userId: string, userField: string, replaceValue:string, jwtToken: string ): Observable<MessageResponse>{
    return this.httpClient.put<MessageResponse>(USER_API + '/users/update?userId=' + userId
                                        + '&userField='+ userField
                                        + '&replaceValue=' + replaceValue,
    {headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('updateUserTokens', {} as MessageResponse)));
  }

  public deleteUser(userId: string, jwtToken: string):Observable<MessageResponse>{
    return this.httpClient.delete<MessageResponse>(USER_API + '/users/delete?userId=' + userId,
    {headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('updateUserTokens', {} as MessageResponse)));
  }

  public deleteUserField(userId: string, userField: string, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.delete<MessageResponse>(USER_API + '/delete?userId=' + userId
                                          + '&userField=' + userField, 
    {headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('updateUserTokens', {} as MessageResponse)));
  }

  public deleteUserTransaction(userId: string, transactionId: string, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.delete<MessageResponse>(USER_API + '/users/transactions/delete?userId=' + userId + '&transactionId=' + transactionId,
    {headers: new HttpHeaders({ 'Authorization': 'Bearer ' + jwtToken})})
    .pipe(
      catchError(this.handleError('deleteUserTransaction', {} as MessageResponse))
    );
  }

  public updateUserTokens(userTokenRequest: UserTokenRequest, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(USER_API + '/tokens/add', userTokenRequest,
    {headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('updateUserTokens', {} as MessageResponse)));
  }

  public banPlayer(userId: string, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(USER_API + '/ban?userId=' + userId,
    {headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('banPlayer', {} as MessageResponse)));
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