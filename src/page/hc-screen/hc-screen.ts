import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { HCenter } from '../../app/services/h_center/h-center';
import { H_Center } from '../../app/services/interface/h_center.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-hc-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './hc-screen.html',
  styleUrl: './hc-screen.css',
})
export class HcScreen implements OnInit {
  private hcenterService = inject(HCenter);
  private cdr = inject(ChangeDetectorRef);

  private stopLoading() {
    this.loading = false;
    this.isUpdating = false;
    this.cdr.detectChanges();
  }

  h_center: H_Center[] = [];
  filteredHCenter: H_Center[] = [];
  searchTerm: string = '';
  loading = false;
  isUpdating = false;

  ngOnInit() {
    const cache = this.hcenterService.getCacheData();

    if (cache && cache.length > 0) {
      const hcData = cache.filter((item) => item.role === 'Sender');
      this.h_center = [...hcData];
      this.filteredHCenter = [...hcData];
      this.cdr.detectChanges();
    }

    this.loadHCenter();
  }

  loadHCenter(isManual = false) {
    if (isManual) {
      this.isUpdating = true;
    } else if (this.h_center.length === 0) {
      this.loading = true;
    }

    this.hcenterService
      .getAllHCenterData()
      .pipe(
        finalize(() => {
          this.stopLoading();
        }),
      )
      .subscribe({
        next: (data) => {
          if (data) {
            const hcData = data.filter((item) => item.role === 'Sender');

            this.h_center = [...hcData];

            if (!this.searchTerm) {
              this.filteredHCenter = [...hcData];
            } else {
              this.onSearch();
            }

            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('โหลดข้อมูลศูนย์บริการพลาด:', err);
          this.stopLoading();
        },
      });
  }

  onSearch() {
    const search = this.searchTerm.trim().toLowerCase();
    if (!search) {
      this.filteredHCenter = [...this.h_center];
      return;
    }

    this.filteredHCenter = this.h_center.filter(
      (item) =>
        (item.h_name && item.h_name.toLowerCase().includes(search)) ||
        (item.hcode && item.hcode.includes(search)),
    );
  }
}
