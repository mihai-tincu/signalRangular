using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRSimpleChat
{    
    public class Chat : Hub // Hub<Interface>
    {
        public string ServerNick
        {
            get
            {
                return "server";
            }
        }

        public async Task Send(string nick, string message)
        {
            await Clients.All.SendAsync("Send", nick, message);
        }

        public async Task JoinGroup(string nick)
        {
            await Clients.All.SendAsync("Send", nick, "joined");
        }

        public async Task LeaveGroup(string nick)
        {
            await Clients.All.SendAsync("Send", nick, "disconected");
        }

        public async Task Notify(string message)
        {
            // Clients.Group hash
               await Clients.All.SendAsync("Send", ServerNick, message);
        }
    }
}
