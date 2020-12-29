import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , of } from 'rxjs';
import { ImageModel } from 'src/app/models/imagemodel';
import { catchError } from 'rxjs/operators';

const IMAGES_API = 'http://localhost:8081/eventimagesapi/images';

@Injectable({
  providedIn: 'root'
})
export class TeamImageService {

  constructor(private httpClient: HttpClient) {

  }

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

  public getTeamImage(teamId: string ): Observable<ImageModel> {
    return this.httpClient.get<ImageModel>(IMAGES_API + '/search?teamId=' + teamId)
    .pipe(catchError(this.handleError('getTeamImage', {} as ImageModel)));
  }

  public postTeamImage(teamId: string, fileData: FormData): Observable<string>{
    return this.httpClient.post<string>(IMAGES_API + '/save?teamId=' + teamId,
     fileData)
    .pipe(catchError(this.handleError('postTeamImage', {} as string)));
  }
}