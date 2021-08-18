import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainHomeComponent } from './components/pages/main-home/main-home.component';
import { TournamentsHomeComponent } from './components/pages/tournaments-home/tournaments-home.component';
import { StreamingHomeComponent } from './components/pages/streaming-home/streaming-home.component';
import { TeamPageComponent } from './components/pages/team-page/team-page.component';
import { ComingSoonPageComponent } from './components/pages/coming-soon-page/coming-soon-page.component';
import { ErrorPageComponent } from './components/pages/error-page/error-page.component';
import { ProductsListPageTwoComponent } from './components/pages/products-list-page-two/products-list-page-two.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { ProductsDetailsPageComponent } from './components/pages/products-details-page/products-details-page.component';
import { ProfileAuthenticationPageComponent } from './components/pages/profile-authentication-page/profile-authentication-page.component';
import { ProfileRegistrationPageComponent } from './components/pages/profile-registration-page/profile-registration-page.component';
import { PlayerDetailsPageComponent } from './components/pages/player-details-page/player-details-page.component';
import { TeamDetailsPageComponent } from './components/pages/team-details-page/team-details-page.component';
import { MatchDetailsPageComponent } from './components/pages/match-details-page/match-details-page.component';
import { TournamentsDetailsPageComponent } from './components/pages/tournaments-details-page/tournaments-details-page.component';
import { StreamSchedulePageComponent } from './components/pages/stream-schedule-page/stream-schedule-page.component';
import { MyTeamsPageComponent } from './components/pages/my-teams/my-teams-page';
import { TeamCreationPageComponent } from './components/pages/team-creation-page/team-creation-page.component';
import { TeamInvitesPageComponent } from './components/pages/team-invites/team-invites-page';
import { TournamentCreationPageComponent } from './components/pages/tournament-creation-page/tournament-creation-page';
import { TournamentCreationConfigPageComponent } from './components/pages/tournament-creation-config-page/tournament-creation-config-page';
import { MyTournamentsComponent } from './components/pages/my-tournaments/my-tournaments.component';
import { AccountDetailsComponent } from './components/pages/account-details/account-details'; 
import { ShopStyleTwoComponent } from './components/common/shop-style-two/shop-style-two.component';
import { ChallengeCreationPageComponent } from './components/pages/challenge-creation-page/challenge-creation-page';
import { ChallengeCreationConfigPageComponent } from './components/pages/challenge-creation-config-page/challenge-creation-config-page';
import { ChallengesHomeComponent } from './components/pages/challenges-home/challenges-home.component';
import { ChallengesDetailsPageComponent } from './components/pages/challenges-details-page/challenges-details-page.component';
import { ChallengeMatchDetailsPageComponent } from './components/pages/challenge-match-details-page/challenge-match-details-page.component';
import { LeaderboardsPageComponent } from './components/pages/leaderboards-page/leaderboards-page.component';

const routes: Routes = [
    {path: '', component: MainHomeComponent},
    {path: 'tournaments', component: TournamentsHomeComponent},
    {path: 'leaderboards', component: LeaderboardsPageComponent},
    {path: 'challenges', component: ChallengesHomeComponent},
    {path: 'tournament-details', component: TournamentsDetailsPageComponent},
    {path: 'challenge-details', component: ChallengesDetailsPageComponent},
	{path: 'shopstyletwo', component: ShopStyleTwoComponent},
    {path: 'streaming', component: StreamingHomeComponent},
    {path: 'our-team', component: TeamPageComponent},
	{path: 'my-tournaments', component: MyTournamentsComponent},
    {path: 'my-teams', component: MyTeamsPageComponent},
    {path: 'team-invites', component: TeamInvitesPageComponent},
    {path: 'team-details', component: TeamDetailsPageComponent},
    {path: 'team-creation', component: TeamCreationPageComponent},
    {path: 'challenge-match-details', component: ChallengeMatchDetailsPageComponent},
    {path: 'match-details', component: MatchDetailsPageComponent},
    {path: 'coming-soon', component: ComingSoonPageComponent},
    {path: 'error', component: ErrorPageComponent},
    {path: 'stream-schedule', component: StreamSchedulePageComponent},
    {path: 'match-details', component: MatchDetailsPageComponent},
    {path: 'player-details', component: PlayerDetailsPageComponent},
	{path: 'my-account', component: AccountDetailsComponent},
    {path: 'shop', component: ProductsListPageTwoComponent},
    {path: 'cart', component: CartPageComponent},
    {path: 'checkout', component: CheckoutPageComponent},
    {path: 'single-products', component: ProductsDetailsPageComponent},
    {path: 'login', component: ProfileAuthenticationPageComponent},
    {path: 'register', component: ProfileRegistrationPageComponent},
	{path: 'tournament-creation', component: TournamentCreationPageComponent},
    {path: 'tournament-creation-config', component: TournamentCreationConfigPageComponent },
    {path: 'challenge-creation', component: ChallengeCreationPageComponent},
    {path: 'challenge-creation-config', component: ChallengeCreationConfigPageComponent},
    {path: '**', component: ErrorPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }