import { computed, Injectable, signal } from '@angular/core';
import { WorkflowsPageData } from './workflows-page-data';

@Injectable({
  providedIn: 'root'
})
export class WorkflowsPagesService {
  private workflowsPagesSignal = signal<WorkflowsPageData[]>([
    {name: "Meus Workflows", route: "/workflows/meus-workflows", title: "Workflows ativos iniciados por você"},
    {name: "Minhas Tarefas", route: "/workflows/minhas-tarefas", title: "Workflows com tarefas pendentes para você"},
    {name: "Todos Workflows", route: "/workflows/todos", title: "Todos os workflow ativos"}
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
