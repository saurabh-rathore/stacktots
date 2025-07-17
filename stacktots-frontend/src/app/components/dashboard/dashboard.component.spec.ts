import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { ContentService } from '../../services/content.service';
import { TtsService } from '../../services/tts.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let contentService: ContentService;
  let ttsService: TtsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DashboardComponent
      ],
      providers: [ContentService, TtsService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    contentService = TestBed.inject(ContentService);
    ttsService = TestBed.inject(TtsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch content on init', () => {
    const mockContent = [
      { id: 1, title: 'Story 1', type: 'story' },
      { id: 2, title: 'Game 1', type: 'game' },
    ];
    spyOn(contentService, 'getContent').and.returnValue(of(mockContent));
    component.ngOnInit();
    expect(component.stories.length).toBe(1);
    expect(component.games.length).toBe(1);
  });
});
