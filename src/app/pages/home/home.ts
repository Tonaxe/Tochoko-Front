import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Drop {
  name: string;
  slug: string;
  status: 'active' | 'soldout';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  drops: Drop[] = [
    {
      name: 'Drop 000',
      slug: 'drop-000',
      status: 'soldout',
    },
    {
      name: 'Drop 001',
      slug: 'drop-001',
      status: 'active',
    },
    {
      name: 'Drop 001.1',
      slug: 'drop-001-1',
      status: 'active',
    },
  ];
}
