import { Component, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-nav',
  imports: [
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})

export class NavbarComponent implements OnInit {
  githubUser: string | null = null;
  token: string | null = null;
  responseMessage: string = '';

  constructor(
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ponds: any[] = [];

}
