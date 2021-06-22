import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CountryService } from 'src/app/services/country.service';
import { FormControl } from '@angular/forms';

export interface DialogDataCountry{
  replaceValueCountry: string;
}

@Component({
  selector: 'app-fieldform-country',
  templateUrl: './fieldform-country.component.html',
  styleUrls: ['./fieldform-country.component.scss']
})
export class FieldformCountryComponent implements OnInit {

  countryInfo: any[] = [];
  selectedCountry: FormControl;
  
  constructor(public dialogRef: MatDialogRef<FieldformCountryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogDataCountry,
              private countryService: CountryService) {
    this.selectedCountry = new FormControl();
  }

  ngOnInit(): void {
    this.getAllCountries();
  }

  getAllCountries(){
    this.countryInfo = this.countryService.getCountriesData();
  }

  public confirm(){
    if(this.selectedCountry.value){
      this.data.replaceValueCountry = this.selectedCountry.value;
      this.dialogRef.close(this.data);
    }
  }

  public onNoClick(){
    this.dialogRef.close();
  }

  updateCountry(event: any){
    this.selectedCountry.setValue(event.target.value, {
      onlySelf: true
    });
  } 

}
