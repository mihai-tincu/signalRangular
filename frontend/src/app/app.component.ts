import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@aspnet/signalr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DocumentChanged, Subscription, RegistrationResponse } from '../models';

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

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.url)
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection.start().catch(err => console.error(`Error starting hub: ${err}`));

    this.hubConnection.on('Send', (nick, message) => {
      this.messages.push(`${nick}: ${message}`);
    });
  }

  subscribeToHash(): void {
    this.hubConnection.invoke('JoinGroup', this.filterHash)
      .catch((err) => this.messages.push(`Error calling JoinGroup: ${err}`));
  }

  unsubscribeToHash() {
    this.hubConnection.invoke('LeaveGroup', this.filterHash)
      .catch((err) => this.messages.push(`Error calling LeaveGroup: ${err}`));
    }

  sendMessage() {
    this.hubConnection.invoke('Send', this.filterHash, this.filter)
      .then(() => {
        // this.messages.push(`${this.filterHash}: ${this.filter}`);
        this.filter = '';
      })
      .catch((err) => this.messages.push(`Error sending message: ${err}`));
  }

  clearMessages(): void {
    this.messages = [];
  }
}
