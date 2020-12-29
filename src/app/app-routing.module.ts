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
import { AccountDetailsComponent } from './components/pages/account-details/account-details';
import { TournamentCreationPageComponent } from './components/pages/tournament-creation/tournament-creation-page';
import { MyTeamsPageComponent } from './components/pages/my-teams/my-teams-page';
import { TeamCreationPageComponent } from './components/pages/team-creation-page/team-creation-page.component';
import { TeamInvitesPageComponent } from './components/pages/team-invites/team-invites-page';

const routes: Routes = [
    {path: '', component: MainHomeComponent},
    {path: 'tournaments', component: TournamentsHomeComponent},
    {path: 'tournament-creation', component: TournamentCreationPageComponent},
    {path: 'tournament-details', component: TournamentsDetailsPageComponent},
    {path: 'streaming', component: StreamingHomeComponent},
    {path: 'our-team', component: TeamPageComponent},
    {path: 'my-teams', component: MyTeamsPageComponent},
    {path: 'team-invites', component: TeamInvitesPageComponent},
    {path: 'team-details', component: TeamDetailsPageComponent},
    {path: 'team-creation', component: TeamCreationPageComponent},
    {path: 'coming-soon', component: ComingSoonPageComponent},
    {path: 'error', component: ErrorPageComponent},
    {path: 'stream-schedule', component: StreamSchedulePageComponent},
    {path: 'single-match', component: MatchDetailsPageComponent},
    {path: 'player-details', component: PlayerDetailsPageComponent},
    {path: 'account-details', component: AccountDetailsComponent},
    {path: 'shop', component: ProductsListPageTwoComponent},
    {path: 'cart', component: CartPageComponent},
    {path: 'checkout', component: CheckoutPageComponent},
    {path: 'single-products', component: ProductsDetailsPageComponent},
    {path: 'login', component: ProfileAuthenticationPageComponent},
    {path: 'register', component: ProfileRegistrationPageComponent},
    {path: '**', component: ErrorPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }