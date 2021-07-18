import { Component, OnInit } from '@angular/core';
import { ImageModel } from 'src/app/models/imagemodel';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/team/team-service.service';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../../models/user/user';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

  constructor(private teamService: TeamService,
              private userService: UserService) {

  }

  public selectedImage: ImageModel;

  // private onSuccess(){
  //   this.selectedImage.pending = false;
  //   this.selectedImage.status = 'ok';
  // }

  // private onError(){
  //   this.selectedImage.pending = false;
  //   this.selectedImage.status = ' ';
  //   this.selectedImage.imageSrc = ' ';
  // }

  // public processFileOnTeam(image: any, team?: Team): void{
  //   const file: File = image.files[0];
  //   const reader: FileReader = new FileReader();
  //   reader.addEventListener('load', (event: any) => {
  //     this.selectedImage = new ImageModel(file, event.target.result);
  //     this.teamService.addImageToTeam(team, this.selectedImage)
  //     .subscribe((resp: void) => {
  //       console.log(resp);
  //       this.onSuccess();
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.onError();
  //     });
  //   });
  //   reader.readAsDataURL(file);
  // }

  // public processFileOnUser(image: any, user: User): void{
  //   const file: File =  image.files[0];
  //   const reader: FileReader = new FileReader();
  //   reader.addEventListener('load', (event: any) => {
  //     this.selectedImage = new ImageModel(file, event.target.result);
  //     this.userService.addImageToUser(user, this.selectedImage)
  //     .subscribe((resp: void) => {
  //       console.log(resp);
  //       this.onSuccess();
  //     },
  //     (err: void) => {
  //       console.error(err);
  //       this.onError();
  //     });
  //     reader.readAsDataURL(file);
  //   });

  // }

  ngOnInit(): void {

  }
}