import { Server } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";

const userMap = {
  // map socket.id to user nick
};
let users = []

let count =0;
function buildMessage(who, what) {
  // convert to POJO (Plain Old Javascript Object)
  // information sent thru the socket has to be able to be stringified & parsed
  // (JSON.stringify, JSON.parse)
  count = count + 1
  return { id: count, message: who.nickname + ': ' + what };

}

export default defineNuxtModule({
  setup(_, nuxt) {
    nuxt.hook("listen", (server) => {
      console.log("Socket listen", server.address(), server.eventNames());
      const io = new Server(server);

      nuxt.hook("close", () => io.close());

      io.on('connection', (socket) => {
        console.log('Connection', socket.id);
        socket.on('join', (data) => {
          socket.nickname = data.nickname;
          users.push(socket.nickname);
          socket.emit('message', buildMessage(socket, `welcome ${socket.nickname}`));
          socket.broadcast.emit('message', buildMessage(socket, `${socket.nickname} joined`));
          io.emit('updateUsers', users);
        });
        socket.on('typing', (nickname) => {
          socket.broadcast.emit('message', buildMessage(socket, `${nickname} is typing...`));
        });
        // propably not useful to display that the user stopped typing after they have sent the message, but up to preference.
          socket.on('stop_typing', (nickname) => {
          socket.broadcast.emit('message', buildMessage(socket, `${nickname} stopped typing`));
        });
      });

      io.on("connect", (socket) => {

        socket.on("message", function message(data) {
          console.log("message received: %s", data);
          socket.broadcast.emit("message", buildMessage(socket, data));
        });

        socket.on("disconnecting", () => {
          console.log("disconnected", socket.id);
          socket.broadcast.emit('message', buildMessage(socket, `${socket.nickname} left`));
        });
      });
    });
  },
});
