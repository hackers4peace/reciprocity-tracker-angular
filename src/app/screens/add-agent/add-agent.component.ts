import { Component, OnInit } from '@angular/core';
import { StateService } from '../../state.service';
import { NgForm } from '@angular/forms';
import { Agent } from 'reciprocity-tracker-state-actor/lib/interfaces';

import cuid from 'cuid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss'],
})
export class AddAgentComponent implements OnInit {
  agents$: Observable<Agent[]>;

  constructor(
    private stateService: StateService,
  ) {
    this.agents$ = this.stateService.state$.pipe(
      map((state: any) => state.agents || []),
    );
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.stateService.actions.addAgent({ id: cuid(), name: form.value.name });
    }
  }

  ngOnInit() {
  }
}
