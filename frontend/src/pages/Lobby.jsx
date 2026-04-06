import { useState } from "react";
import { connectSocket, socket } from "../socket";
import { useNavigate } from "react-router-dom";
import { AiFillPlusCircle } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { ImEnter } from "react-icons/im";
import { FaArrowRight } from "react-icons/fa6";
import { FaLightbulb } from "react-icons/fa";
import { PiNumberCircleOne } from "react-icons/pi";
import { PiNumberCircleTwoLight } from "react-icons/pi";
import { PiNumberCircleThreeLight } from "react-icons/pi";

export const Lobby = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  function createRoom() {
    connectSocket();
    socket.emit("room:create", (response) => {
      if (!response?.ok) return alert(response.message);
      // navigate to -> /rooms/:roomCode
      navigate(`/rooms/${response.room.roomCode}`);
    });
  }

  function joinRoom() {
    connectSocket();
    socket.emit("room:join", roomCode, (response) => {
      if (!response?.ok)
        return alert(response.message || "Failed to join room");
      navigate(`/rooms/${response.room.roomCode}`);
    });
  }

  return (
    <div className="flex flex-col justify-center items-center gap-16">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-3xl font-bold text-blue-800">Welcome to Chess</h1>
        <p className="text-xl text-gray-600">
          Create a room or join an existing one to start playing
        </p>
      </div>
      <div className="flex gap-16">
        <div className="bg-white shadow-xl w-[380px] p-8 border rounded flex flex-col gap-4 items-center justify-center">
          <AiFillPlusCircle
            size={48}
            color="#5769dc"
            onClick={createRoom}
            className="cursor-pointer"
          />
          <h2 className="text-2xl text-[#5769dc] font-bold">Create Room</h2>
          <p className="text-xl text-gray-600 w-[70%] text-center">
            Start a new game and share the room code with your opponent
          </p>
          <button
            onClick={createRoom}
            className="bg-[#5769dc] p-4 rounded text-white font-bold text-xl justify-center flex items-center gap-4 w-[100%]"
          >
            <FaPlus />
            Create Room
          </button>
        </div>
        <div className="relative pt-20">
          <div className="h-[180px] border w-[2px]"></div>
          <span className="absolute top-[150px] left-[-20px] text-2xl bg-white p-2 rounded">
            OR
          </span>
        </div>
        <div className="bg-white shadow-xl w-[380px] p-8 border rounded flex flex-col gap-4 items-center justify-center">
          <ImEnter
            size={48}
            color="#4f7a41"
            onClick={joinRoom}
            className="cursor-pointer"
          />
          <h2 className="text-2xl text-[#4f7a41] font-bold">Join Room</h2>
          <p className="text-xl text-gray-600 w-[70%] text-center">
            Enter a room code to join an existing room
          </p>
          <input
            className="p-2 border rounded w-[100%] text-xl"
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
          <button
            onClick={joinRoom}
            className="bg-[#4f7a41] p-4 rounded text-white font-bold text-xl justify-center flex items-center gap-4 w-[100%]"
          >
            <FaArrowRight />
            Join Room
          </button>
        </div>
      </div>
      <div className="border border-blue-500 rounded bg-white p-10 flex flex-col gap-4 shadow-xl">
        <p className="text-2xl font-bold flex items-center gap-2">
          <FaLightbulb color="#cdbc2b" />
          How it works?
        </p>
        <div className="flex gap-8 text-xl">
          <span className="flex gap-2 items-center">
            <PiNumberCircleOne size={32} color="blue" />
            Create or join a room
          </span>
          <span className="border h-[50px] w-[2px]"></span>
          <span className="flex gap-2 items-center">
            <PiNumberCircleTwoLight size={32} color="green" />
            Wait for opponent
          </span>
          <span className="border h-[50px] w-[2px]"></span>
          <span className="flex gap-2 items-center">
            <PiNumberCircleThreeLight size={32} color="purple" />
            Play chess in real-time
          </span>
        </div>
      </div>
    </div>
  );
};
