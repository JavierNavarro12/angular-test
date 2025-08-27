import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeChart } from './realtime-chart';

describe('RealtimeChart', () => {
  let component: RealtimeChart;
  let fixture: ComponentFixture<RealtimeChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimeChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtimeChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
