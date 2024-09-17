import { Component, inject, OnInit } from '@angular/core';
import { WorkflowsPagesService } from '../workflows-pages.service';

@Component({
  selector: 'app-all-workflows',
  standalone: true,
  imports: [],
  templateUrl: './all-workflows.component.html',
  styleUrl: './all-workflows.component.scss'
})
export class AllWorkflowsComponent implements OnInit {
  workflowsPagesService = inject(WorkflowsPagesService);

  ngOnInit(): void {
    const activePage = this.workflowsPagesService.workflowsPages().find(pages => pages.name == "Todos Workflows")!;
    this.workflowsPagesService.setActivePage(activePage);
  }

}
