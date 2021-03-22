import { Team } from '../team';
import { ImageModel } from '../imagemodel';
import { UserTournament } from '../user/user-tournament';
import { Role } from '../role';

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
	userRoles: Array<Role>;
	userImage: FormData;
	userGetImage: ImageModel;
	userTournament: UserTournament;

	constructor(userRealName?: string, userName?: string, userPassword?: string,
		userEmail?: string, userCountry?: string, userBirthDate?: any,
		userRoles?: Array<Role>) {

		this.userRealName = userRealName;
		this.userName = userName;
		this.userPassword = userPassword;
		this.userEmail = userEmail;
		this.userCountry = userCountry;
		this.userBirthDate = userBirthDate;
		this.userRoles = userRoles;
	}
	
}