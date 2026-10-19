import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subtitle',
  standalone: true,
  imports: [],
  templateUrl: './subtitle.component.html',
})
export class SubtitleComponent {
  @Input() subtitle = '';
}
