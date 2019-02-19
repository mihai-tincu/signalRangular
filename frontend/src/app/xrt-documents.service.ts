import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class XrtDocumentsService {
  private readonly dataSource = new BehaviorSubject<any>(null);
  private readonly hubConnection: HubConnection;
  private hubUrl = 'http://localhost:53036/chat';

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection.start().catch(err => console.error(`Error starting hub: ${err}`));

    this.hubConnection.on('Send', (sender, message) => {
      // this.dataSource.next(message); // todo uncomment
      this.dataSource.next(`'${sender}: ${message}`); // todo remove
    });
  }

  get documents$(): Observable<any> {
    return this.dataSource.asObservable();
  }

  subscribeToHash(hash: string) {
    this.hubConnection.invoke('JoinGroup', hash)
      .catch((err) => console.log(`Error calling JoinGroup: ${err}`));
  }
  unsubscribeFromHash(hash: string) {
    this.hubConnection.invoke('LeaveGroup', hash)
      .catch((err) => console.log(`Error calling LeaveGroup: ${err}`));
  }

  sendMessage(sender, message) {
    this.hubConnection.invoke('Send', sender, message)
      .catch((err) => console.log(`Error sending message: ${err}`));
  }
}
