import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDataTable } from './live-data-table';

describe('LiveDataTable', () => {
  let component: LiveDataTable;
  let fixture: ComponentFixture<LiveDataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveDataTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveDataTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
