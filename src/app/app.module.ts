import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddAgentComponent } from './screens/add-agent/add-agent.component';

import { StateService } from './state.service';

@NgModule({
  declarations: [
    AppComponent,
    AddAgentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: StateService.init,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
