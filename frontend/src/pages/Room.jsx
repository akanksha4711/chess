import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connectSocket, socket } from "../socket";
import { useSelector } from "react-redux";
import { Chessboard } from "@gustavotoyota/react-chessboard";

export const Room = () => {
  const { roomCode } = useParams();
  const [room, setRoom] = useState(null);
  const [fen, setFen] = useState(null);
  const [turn, setTurn] = useState(null);
  const [color, setColor] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    connectSocket();

    socket.emit("room:join", roomCode, (response) => {
      if (!response?.ok)
        return alert(response?.message || "Failed to join room");
      setRoom(response.room);
    });

    socket.emit("game:state", roomCode, (response) => {
      if (!response?.ok)
        return alert(response?.message || "Failed to fetch game state");
      setFen(response?.state?.fen);
      setTurn(response?.state?.turn);
      setColor(
        user._id.toString() === response?.state?.whiteId.toString()
          ? "White"
          : "Black",
      );
    });

    const onPresence = (data) => {
      setRoom(data);
    };

    socket.on("room:presence", onPresence);

    const onUpdate = (state) => {
      console.log("game:update", state.fen);
      setFen(state.fen);
      setTurn(state.turn);
    };

    socket.on("game:update", onUpdate);
    // Add "game:over" event listener

    return () => {
      socket.off("room:presence", onPresence);
      socket.off("game:update", onUpdate);
    };
  }, [roomCode, room?.whiteId, user._id]);

  function leaveRoom() {
    // connect to the socket if not connected -> connectSocket()
    connectSocket();
    // emit a "room:leave" event with roomCode and acknowledgment () as payload
    socket.emit("room:leave", roomCode, (response) => {
      if (!response?.ok)
        return alert(response?.message || "Failed to leave room");
      // redirect to the lobby
      setRoom(response?.room);
      navigate("/lobby");
    });
  }

  // We emit "game:move"
  function onDrop(sourceSquare, targetSquare) {
    connectSocket();
    if (!fen) return false;
    socket.emit(
      "game:move",
      roomCode,
      sourceSquare,
      targetSquare,
      "q",
      (response) => {
        if (!response?.ok) return alert(response?.message || "Invalid move");
      },
    );

    return true;
  }

  return (
    <div>
      <h1 className="text-3xl">Room: {roomCode}</h1>
      <p>Status: {room?.status}</p>
      <ul>
        {room?.players.map((p) => (
          <li>{p.userId === user._id ? p.name + "(Me)" + color : p.name}</li>
        ))}
      </ul>
      <div className="flex gap-2">
        {/* {room?.status === "ready" && (
          <button className="bg-green-400 p-2 rounded">Start Game</button>
        )} */}
        <button onClick={leaveRoom} className="bg-red-400 p-2 rounded">
          Leave
        </button>
      </div>
      {room?.status === "ready" && (
        <div className="w-[480px]">
          <div>Turn: {turn === "w" ? "White" : "Black"}</div>
          <Chessboard
            id="room-board"
            position={fen || "start"}
            onPieceDrop={onDrop}
          />
        </div>
      )}
    </div>
  );
};
