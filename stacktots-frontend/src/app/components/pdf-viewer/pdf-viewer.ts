import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.html',
  styleUrls: ['./pdf-viewer.scss'],
  standalone: true,
  imports: [CommonModule, PdfViewerModule]
})
export class PdfViewerComponent implements OnInit {
  pdfSrc: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pdfSrc = this.route.snapshot.queryParamMap.get('url');
  }
}
