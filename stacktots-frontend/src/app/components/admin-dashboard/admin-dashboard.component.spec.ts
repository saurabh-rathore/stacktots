import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ContentService } from '../../services/content.service';
import { of } from 'rxjs';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let contentService: ContentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        AdminDashboardComponent
      ],
      providers: [ContentService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    contentService = TestBed.inject(ContentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load content on init', () => {
    const mockContent = [
      { id: 1, title: 'Story 1', type: 'story' },
      { id: 2, title: 'Game 1', type: 'game' },
    ];
    spyOn(contentService, 'getContent').and.returnValue(of(mockContent));
    component.ngOnInit();
    expect(component.content.length).toBe(2);
  });

  it('should create content', () => {
    const mockContent = { title: 'New Content', description: 'This is new content', type: 'story' };
    spyOn(contentService, 'createContent').and.returnValue(of({ message: 'Content created successfully' }));
    spyOn(contentService, 'getContent').and.returnValue(of([]));
    component.contentForm.setValue(mockContent);
    component.onSubmit();
    expect(contentService.createContent).toHaveBeenCalled();
  });
});
