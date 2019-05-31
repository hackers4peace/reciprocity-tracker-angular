import { Component, OnInit } from '@angular/core';
import { StateService } from '../../state.service';
import { FormBuilder, Validators } from '@angular/forms';
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
  agent = this.fb.group({
    name: ['', [Validators.required]],
  });
  agents$ = this.stateService.state$.pipe(
    map((state: any) => state.agents || []),
  );

  constructor(
    private stateService: StateService,
    private fb: FormBuilder,
  ) {}

  onSubmit({ value, valid }: { value: object, valid: boolean }) {
    console.log(value);
    if (valid) {
      this.stateService.actions.addAgent({ id: cuid(), ...value });
    }
  }

  ngOnInit() {
  }
}
