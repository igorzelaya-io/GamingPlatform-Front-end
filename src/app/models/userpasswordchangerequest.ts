export class UserPasswordChangeRequest {
    
    userPasswordChangeName: string;

    userPasswordChangeCurrentPassword: string;

    userPasswordChangeNewPassword: string;

    constructor(userPasswordChangeName?: string, userPasswordChangeCurrentPassword?: string,
                userPasswordChangeNewPassword?: string){
        this.userPasswordChangeName = userPasswordChangeName;
        this.userPasswordChangeCurrentPassword = userPasswordChangeCurrentPassword;
        this.userPasswordChangeNewPassword = userPasswordChangeNewPassword;
    }

}