import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryDirectoriesListComponent } from './library-directories-list.component';

describe('LibraryDirectoriesListComponent', () => {
  let component: LibraryDirectoriesListComponent;
  let fixture: ComponentFixture<LibraryDirectoriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryDirectoriesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryDirectoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
