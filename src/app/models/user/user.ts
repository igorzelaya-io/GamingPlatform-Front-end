import { Team } from '../team';
import { ImageModel } from '../imagemodel';
import { UserTournament } from '../user/user-tournament';
import { Role } from '../role';
import { TeamInviteRequest } from '../teaminviterequest';

export class User {
	userId: string;
	userRealName: string;
	userName: string;
	userPassword: string;
	userEmail: string;
	userStatusCode: string;
	userTeams: Array<Team>;
	userBilling: string;
	userCountry: string;
	userTokens: number;
	userCash: number;
	userBirthDate: any;
	userTeamRequests: Array<TeamInviteRequest>;
	userRoles: Array<Role>;
	userImage: FormData;
	userGetImage: ImageModel;
	userTournaments: Array<UserTournament>;
	userTotalWs: number;
	userTotalLs: number;

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