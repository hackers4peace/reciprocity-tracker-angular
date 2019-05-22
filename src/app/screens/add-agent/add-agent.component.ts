import { Component, OnInit } from '@angular/core';
import { StateService } from '../../state.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent implements OnInit {

  constructor(private stateService: StateService) { }

  ngOnInit() {
    
  }

}
