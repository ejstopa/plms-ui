export interface WorkflowInstance {
    id: number;
    workflowTemplateId: number;
    itemId: number;
    itemRevision: string;
    userId: number;
    currentStepId: number;
    previousStepId: number;
    status: string;
    message: string;
}
