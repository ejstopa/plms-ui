import { Routes } from '@angular/router';
import { MainPageComponent } from './features/main/main-page/main-page.component';
import { LoginPageComponent } from './core/auth/login-page/login-page.component';
import { AuthGuard } from './core/auth/auth.guard';
import { WorkspacePageComponent } from './features/workspace/workspace-page/workspace-page.component';
import { LibraryPageComponent } from './features/library/library-page/library-page.component';
import { WorkflowsPageComponent } from './features/workflows/workflows-page/workflows-page.component';
import { SearchPageComponent } from './features/search/search-page/search-page.component';
import { LibraryDirectoriesListComponent } from './features/library/library-directories-list/library-directories-list.component';
import { LibraryDirectoryPageComponent } from './features/library/library-directory-page/library-directory-page.component';

export const routes: Routes = [
    {path: "", component:MainPageComponent, canActivate: [() => AuthGuard()], children:[
        {path: "", redirectTo:"workspace", pathMatch: "full"},
        {path: "workspace", component:WorkspacePageComponent},
        {path: "library", loadComponent: () => LibraryPageComponent, children: [
            {path: "", redirectTo:"diretorios", pathMatch: "full"},
            {path: "diretorios", component: LibraryDirectoriesListComponent},
            {path: "diretorios/:directoryName", component: LibraryDirectoryPageComponent}
        ]},
        {path: "pesquisa", loadComponent: () => SearchPageComponent},
        {path: "workflows", loadComponent: () => WorkflowsPageComponent}
    ] },
    {path: "login", component:LoginPageComponent}
];
