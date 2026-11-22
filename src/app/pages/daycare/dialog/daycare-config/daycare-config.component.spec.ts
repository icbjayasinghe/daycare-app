import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { DaycareConfigService } from 'src/app/services/daycare-config.service';
import { throwError } from 'rxjs';

import { DaycareConfigComponent } from './daycare-config.component';

describe('DaycareConfigComponent', () => {
  let component: DaycareConfigComponent;
  let fixture: ComponentFixture<DaycareConfigComponent>;
  let configService: jasmine.SpyObj<DaycareConfigService>;

  beforeEach(async () => {
    configService = jasmine.createSpyObj<DaycareConfigService>(
      'DaycareConfigService',
      ['getDaycareConfig', 'registerDaycareConfig', 'updateDaycareConfig'],
    );
    configService.getDaycareConfig.and.returnValue(
      throwError(() => new Error('Not found')),
    );

    await TestBed.configureTestingModule({
      declarations: [DaycareConfigComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 42, name: 'Little Steps' },
        },
        {
          provide: DaycareConfigService,
          useValue: configService,
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the existing configuration by daycare id', () => {
    expect(configService.getDaycareConfig).toHaveBeenCalledWith(42);
  });
});
