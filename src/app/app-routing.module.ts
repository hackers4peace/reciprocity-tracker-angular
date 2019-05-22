import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAgentComponent } from './screens/add-agent/add-agent.component';

const routes: Routes = [
  { path: 'add-agent', component: AddAgentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
