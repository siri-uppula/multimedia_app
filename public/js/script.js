const socket = io("/");
const videoGrid = document.getElementById("video-grid");
var peer = new Peer();
const myvideo = document.createElement("video");
myvideo.muted = true;
let myId;

peer.on("open", (id) => {
  myId = id;
  socket.emit("join-room", roomId, id);
  console.log("asdasdadsadsasdmyid",myId)

});
var peers = {};
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myvideo, stream, myId);
    peer.on("call", (call) => {
      console.log("in the call",myId);
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream, myId) => {
        addVideoStream(video, userVideoStream, myId);
      });
    });
    socket.on("new-user-connection", (userId) => {
      const call = peer.call(userId, stream);
      peers[userId] = call;
      const video = document.createElement("video");
      console.log("new connection ",userId);
      video.classList.add(userId);
      video.classList.add("c-video");
      call.on("stream", (userVideoStream, myId) => {
        addVideoStream(video, userVideoStream, myId);
      });
      call.on("close", () => {
        video.remove();
      });
    });
  });
socket.on("user-disconnected", (userId) => {
  if (document.querySelector("." + userId))
    document.querySelector("." + userId).remove();
  if (peers[userId]) peers[userId].close();
});
const addVideoStream = (video, stream, userId) => {
  video.srcObject = stream;
  if (userId) {
    video.classList.add(userId);
  }
  video.classList.add("c-video");
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  document.querySelector(".mic").style.color = "black";
};

const setUnmuteButton = () => {
  document.querySelector(".mic").style.color = "red";
};

const setStopVideo = () => {
  document.querySelector(".vid").style.color = "black";
};

const setPlayVideo = () => {
  document.querySelector(".vid").style.color = "red";
};
const link = () => {
  var copyText = document.getElementById("myInput");

  copyText.select();

  try {
    document.execCommand("copy");
    alert("Text copied to clipboard!");
  } catch (err) {
    console.error("Unable to copy text: ", err);
    alert("Failed to copy text to clipboard.");
  }
};
