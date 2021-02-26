import { Team } from '../team';
import { ImageModel } from '../imagemodel';
export class User {
	userId: string;
	userRealName: string;
	userName: string;
	userPassword: string;
	userEmail: string;
	userTeam: Team;
	userBilling: string
	userCountry: string;
	userTokens: number;
	userCash: number;
	userBirthDate: any
	userRoles: Array<string>;
	userImage: FormData;
	userGetImage: ImageModel;

	constructor(userRealName?: string, userName?: string, userPassword?: string,
		userEmail?: string, userCountry?: string, userBirthDate?: any,
		userRoles?: Array<string>) {

		this.userRealName = userRealName;
		this.userName = userName;
		this.userPassword = userPassword;
		this.userEmail = userEmail;
		this.userCountry = userCountry;
		this.userBirthDate = userBirthDate;
		this.userRoles = userRoles;
	}
	
}