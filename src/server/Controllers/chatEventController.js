// exports = module.exports = function(io) {
//   io.on("connection", (socket) => {
//     socket.on("join", (userName) => {
//       socket.join(userName);
//       socket.emit("emit", `User joined in own room = ${userName}`);
//     });
//     socket.on("bidAwarded", (result) => {
//       socket
//         .broadcast()
//         .to(result.roomID)
//         .emit("awardedbidresult", result.content);
//     });

//     socket.on("sendMessage", (msg) => {
//       socket.join(msg.user);
//       socket.broadcast.to(msg.user).emit("resendMsg", msg.message);
//     });
//   });
// };
