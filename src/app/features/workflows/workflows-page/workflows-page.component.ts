import { Component } from '@angular/core';
import { WorkflowsNavbarComponent } from '../workflows-navbar/workflows-navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-workflows-page',
  standalone: true,
  imports: [RouterOutlet, WorkflowsNavbarComponent],
  templateUrl: './workflows-page.component.html',
  styleUrl: './workflows-page.component.scss'
})
export class WorkflowsPageComponent {

}
