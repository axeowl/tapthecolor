import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StopPage } from './stop.page';

const routes: Routes = [
  {
    path: '',
    component: StopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StopPageRoutingModule {}
