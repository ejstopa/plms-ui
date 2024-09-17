import { Component, inject, OnInit } from '@angular/core';
import { WorkflowsNavbarComponent } from '../workflows-navbar/workflows-navbar.component';
import { RouterOutlet } from '@angular/router';
import { SideBarNavigatonService } from '../../../core/layout/side-bar/side-bar-navigaton.service';

@Component({
  selector: 'app-workflows-page',
  standalone: true,
  imports: [RouterOutlet, WorkflowsNavbarComponent],
  templateUrl: './workflows-page.component.html',
  styleUrl: './workflows-page.component.scss'
})
export class WorkflowsPageComponent implements OnInit{
  private sideBarNavigatonService = inject(SideBarNavigatonService);
  
  ngOnInit(): void {
    this.sideBarNavigatonService.setActivePage("workflows");
  }

}
