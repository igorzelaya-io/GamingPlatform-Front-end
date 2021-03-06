import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable} from 'rxjs';
import { User } from '../../../models/user/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-search-bar',
  templateUrl: './user-search-bar.component.html',
  styleUrls: ['./user-search-bar.component.scss']
})
export class UserSearchBarComponent implements OnInit {

  txtUsers: FormControl; 

  filteredOptions: Observable<string[]>;
  
  allUsers: User[];
  
  autoCompleteList: User[];
  

  @ViewChild('autocompleteInput') 
  autocompleteInput: ElementRef;

  @Output() 
  selectedOption = new EventEmitter();

  constructor(public userService: UserService) {
	this.txtUsers = new FormControl();
  }

  ngOnInit(): void {
    this.getAllUsers();
    
    this.txtUsers.valueChanges.subscribe(userInput => {
      this.autoCompleteExpenseList(userInput);
    });
  }

  private autoCompleteExpenseList(input: string) {
    let categoryList = this.filterCategoryList(input);
    this.autoCompleteList = categoryList;
  }

  //Filtering happens accodring to typed value.
  filterCategoryList(enteredName: string){
    if (typeof enteredName !== 'string' || enteredName === '' ||  enteredName === null){
      return [];
	}
    return enteredName ? this.allUsers.filter((user: User) =>
        user.userName.toLowerCase().indexOf(enteredName.toLowerCase()) !== -1) : this.allUsers;
  }

  displayFn(user: User){
    let k = user ? user.userName : user;
    return k;
  }

  filterUserList(event: any){
    var users = event.source.value;
    if (!users){
      this.userService.searchOption = [];
    }
    else{
	
      this.userService.searchOption.push(users);
      this.selectedOption.emit(this.userService.searchOption);
    }
    this.focusOnPlaceInput();
  }

  removeOption(userToBeRemoved: User){
    let index = this.userService.searchOption.indexOf(userToBeRemoved);
    if(index >= 0){
      this.userService.searchOption.splice(index, 1);
    }
    this.focusOnPlaceInput();
    this.selectedOption.emit(this.userService.searchOption);
  }

  focusOnPlaceInput(){
    this.autocompleteInput.nativeElement.focus();
    this.autocompleteInput.nativeElement.value = '';
  }

  getAllUsers(){
    this.userService.getAllUsers()
      .subscribe((data: User[]) => {
      this.allUsers = data;
    });
  }

}
