import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WorkflowsPagesService } from '../workflows-pages.service';
import { WorkflowsPageData } from '../workflows-page-data';

@Component({
  selector: 'app-workflows-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './workflows-navbar.component.html',
  styleUrl: './workflows-navbar.component.scss'
})
export class WorkflowsNavbarComponent {
  private router = inject(Router);
  private workflowsPagesService = inject(WorkflowsPagesService);

  workflowsPages = computed(() => this.workflowsPagesService.workflowsPages());
  activePage = computed(() => this.workflowsPagesService.activePage());

  onPageChange(workflowsPageData: WorkflowsPageData){
    this.workflowsPagesService.setActivePage(workflowsPageData);
    this.router.navigate([workflowsPageData.route]);

  }

}
