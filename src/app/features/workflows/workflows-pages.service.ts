import { computed, Injectable, signal } from '@angular/core';
import { WorkflowsPageData } from './workflows-page-data';

@Injectable({
  providedIn: 'root'
})
export class WorkflowsPagesService {
  private workflowsPagesSignal = signal<WorkflowsPageData[]>([
    {name: "Meus Workflows", route: "/workflows/meus-workflows"},
    {name: "Minhas Tarefas", route: "/workflows/minhas-tarefas"},
    {name: "Todos Workflows", route: "/workflows/todos"}
  ]);
  private activePageSignal = signal<WorkflowsPageData>(this.workflowsPagesSignal()[0]);

  workflowsPages= computed(() => this.workflowsPagesSignal());
  activePage = computed(() => this.activePageSignal());

  constructor() { }

  setActivePage(workflowsPageData: WorkflowsPageData){
    let page: WorkflowsPageData | undefined = this.workflowsPagesSignal().find(pageData => pageData == workflowsPageData);

    if (page){
      this.activePageSignal.set(page);
    }
  }
}
