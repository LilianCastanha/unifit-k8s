import { Component } from '@angular/core';
import { TitleComponent } from '@shared/components/title/title.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { SubtitleComponent } from '@shared/components/subtitle/subtitle.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TitleComponent, SubtitleComponent, UsersTableComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent {}
