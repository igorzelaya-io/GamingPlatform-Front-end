import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import { SharedService } from 'src/app/services/helpers/shared-service';

export interface DialogDataDate{
  replaceValueDate: Date;
  alreadySelectedDate: Date;
  isValid: boolean;
}

@Component({
  selector: 'app-fieldform-date',
  templateUrl: './fieldform-date.component.html',
  styleUrls: ['./fieldform-date.component.scss']
})
export class FieldformDateComponent implements OnInit {

  @ViewChild('tournamentDateTimeElement')
  tournamentDateElement: NgxMatDatetimePicker<Date>;


  constructor(public dialogRef: MatDialogRef<FieldformDateComponent>,
              @Inject(MAT_DIALOG_DATA)public data: DialogDataDate,
              private sharedService: SharedService) {
    this.tournamentDateElement = this.sharedService.get();
  }

  public confirm(){
    if(new Date(this.tournamentDateElement._selected).getTime() < new Date().getTime()){
      this.data.replaceValueDate = undefined;
      this.data.isValid = false;
      this.dialogRef.close(this.data);
    }
    else{
      this.data.replaceValueDate = this.tournamentDateElement._selected;
      this.data.isValid = true;
      this.dialogRef.close(this.data);
    }
  }

  public onNoClick(){
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
