import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@aspnet/signalr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DocumentChanged, Subscription, RegistrationResponse } from '../models';
import { XrtDocumentsService } from './xrt-documents.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public messages: string[] = [];
  public filter = '';
  public filterHash = 'cb9ea5738aae7c1d51c8343729f63095';
  private url = 'http://localhost:53036/chat';
  private hubConnection: HubConnection;

  constructor(private httpClient: HttpClient, private documentsService: XrtDocumentsService) { }

  ngOnInit() {
    this.documentsService.documents$.subscribe(data => {
      // this.messages = data; // todo uncomment
      this.messages.push(data); // todo delete
    });
  }

  subscribeToHash(): void {
    this.documentsService.subscribeToHash(this.filterHash);
  }

  unsubscribeToHash() {
      this.documentsService.unsubscribeFromHash(this.filterHash);
  }

  sendMessage() {
    this.documentsService.sendMessage(this.filterHash, this.filter);
    this.filter = '';
  }

  clearMessages(): void {
    this.messages = [];
  }
}
