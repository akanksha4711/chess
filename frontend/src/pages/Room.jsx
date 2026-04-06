import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connectSocket, socket } from "../socket";
import { useSelector } from "react-redux";
import { Chessboard } from "@gustavotoyota/react-chessboard";
import { IoArrowBack } from "react-icons/io5";
import { IoPeopleCircle } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { IoMdPeople } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { FaHashtag } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaChess } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";

export const Room = () => {
  const { roomCode } = useParams();
  const [room, setRoom] = useState(null);
  const [fen, setFen] = useState(null);
  const [turn, setTurn] = useState(null);
  const [color, setColor] = useState(null);
  const [whiteMs, setWhiteMs] = useState(null);
  const [blackMs, setBlackMs] = useState(null);
  const [messages, setMessages] = useState([]);

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
        user._id?.toString() === response?.state?.whiteId?.toString()
          ? "White"
          : "Black",
      );
      setWhiteMs(response?.clock?.whiteMs);
      setBlackMs(response?.clock?.blackMs);
    });
  }, [roomCode, user._id]);

  useEffect(() => {
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

    const onEnd = (result) => {
      alert(result);
    };

    socket.on("game:over", onEnd);

    function onClock(c) {
      if (roomCode !== c.roomCode) return;
      setWhiteMs(c.whiteMs);
      setBlackMs(c.blackMs);
    }

    socket.on("clock:update", onClock);

    return () => {
      socket.off("room:presence", onPresence);
      socket.off("game:update", onUpdate);
      socket.off("game:over", onEnd);
      socket.off("clock:update", onClock);
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
      navigate("/lobby", { replace: true });
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

  function convertTime(ms) {
    if (!ms) return "--:--";
    const total = Math.floor(ms / 1000);
    const m = String(Math.floor(total / 60)).padStart(2, "0");
    const s = String(Math.floor(total % 60)).padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="pl-10 pr-10 pb-10 pt-2 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div
          onClick={() => navigate("/lobby")}
          className="flex items-center text-xl gap-2 text-[#5769dc] cursor-pointer w-fit"
        >
          <IoArrowBack size={28} />
          Back to Lobby
        </div>
        <div className="flex gap-12 items-center">
          <IoPeopleCircle size={100} color="#5769dc" />
          <div className="flex flex-col gap-2">
            <span className="text-4xl font-bold text-blue-900">
              Room: {roomCode}
            </span>
            {room?.status === "waiting" && (
              <span className="p-2 rounded bg-[#e7bd82] text-orange-700 w-fit flex items-center gap-2">
                <MdAccessTime size={24} />
                Waiting for opponent
              </span>
            )}
          </div>
          <div className="text-2xl">
            <button
              onClick={leaveRoom}
              className="bg-red-400 p-2 rounded flex items-center gap-2"
            >
              <ImExit />
              Leave room
            </button>
          </div>
        </div>
      </div>
      <div className="border w-[100%] border h-[2px]"></div>
      <div className="flex gap-8">
        <div className="flex flex-col gap-4 w-[25%]">
          <div className="border rounded shadow-lg flex flex-col gap-4 p-4">
            <div className="flex items-center gap-2 text-xl font-bold">
              <IoMdPeople size={32} />
              Players {room?.players.length === 1 ? "(1/2)" : "(2/2)"}
            </div>
            {room?.players?.map((p) => (
              <div className="p-4 bg-blue-200 rounded flex gap-4 items-center">
                <FaUserCircle size={60} />
                <div className="flex flex-col gap-1">
                  <div className="text-xl font-bold">
                    {p.name}
                    {p.userId.toString() === user._id.toString() && (
                      <span className="ml-4 bg-blue-400 pl-1 pr-2 pt-1 pb-1 rounded">
                        You
                      </span>
                    )}
                  </div>
                  <div>
                    Color:{" "}
                    {room?.status === "waiting"
                      ? "TBD"
                      : p.userId.toString() === room?.whiteId?.toString()
                        ? "White"
                        : "Black"}
                  </div>
                </div>
              </div>
            ))}
            {room?.status === "waiting" && (
              <div className="p-4 bg-gray-200 rounded flex gap-4 items-center">
                <FaUserCircle size={60} />
                <div className="flex flex-col gap-1">
                  <div className="text-xl font-bold">Waiting for opponent</div>
                  <div>Share the roomcode to invite a friend</div>
                </div>
              </div>
            )}
          </div>
          <div className="border rounded shadow-xl flex flex-col gap-4 p-4">
            <div className="flex gap-4 text-xl font-bold items-center pb-2">
              <FaCircleInfo size={28} />
              Room Info
            </div>
            <div className="flex justify-between">
              <div className="flex gap-4 text-lg items-center">
                <FaHashtag size={26} />
                Room Info
              </div>
              <div className="font-bold bg-blue-200 rounded pt-1 pb-1 pl-4 pr-4">
                {roomCode}
              </div>
            </div>
            <div className="border w-[100%]"></div>
            <div className="flex justify-between">
              <div className="flex gap-4 text-lg items-center">
                <MdAccessTime size={28} />
                Time Control
              </div>
              <div className="font-bold">05:00 + 0</div>
            </div>
            <div className="border w-[100%]"></div>
            <div className="flex justify-between">
              <div className="flex gap-4 text-lg items-center">
                <FaCalendarAlt size={26} />
                Created
              </div>
              <div className="font-bold">{room?.createdAt}</div>
            </div>
          </div>
        </div>
        {room?.status === "waiting" ? (
          <div className="w-[75%] flex flex-col items-center gap-4 border shadow-xl rounded pt-10 pl-4 pr-4 pb-4">
            <div className="bg-blue-200 p-10 rounded rounded-full">
              <FaChess size={120} />
            </div>
            <div className="text-3xl font-bold text-blue-900">
              Waiting for Opponent
            </div>
            <div className="text-gray-500">
              Share the roomcode with your friend to start the game.
            </div>
            <div className="flex gap-4 w-[100%] items-center justify-center">
              <div className="border w-[30%]"></div>
              <div className="font-bold">Room Code</div>
              <div className="border w-[30%]"></div>
            </div>
            <div className="pl-8 pr-8 pt-2 pb-2 bg-blue-300 rounded text-2xl font-bold text-blue-900">
              {roomCode}
            </div>
            <div className="w-[fit] border rounded bg-yellow-100 text-lg text-yellow-800 p-4 flex gap-2 items-center">
              <FaLightbulb size={24} />
              <span className="font-bold">Tip:</span>
              Once another player joins, the game will automatically start and
              you'll be assigned a color.
            </div>
          </div>
        ) : (
          <>
            <div className="w-[50%] border rounded shadow-xl pt-2 pb-2 bg-gray-100">
              <div className="flex justify-between pb-2 pl-4 pr-4">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <div
                    className={`w-[20px] h-[20px] border rounded rounded-full ${turn === "w" ? "bg-white" : "bg-black"}`}
                  ></div>
                  Turn: {turn === "w" ? "White" : "Black"}
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center bg-white border rounded p-2 font-bold">
                    <MdAccessTime size={28} />
                    <div className="flex flex-col items-center">
                      <div className="text-sm">White Time</div>
                      <div>{convertTime(whiteMs)}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center bg-gray-700 text-white border rounded p-2 font-bold">
                    <MdAccessTime size={28} />
                    <div className="flex flex-col items-center">
                      <div className="text-sm">Black Time</div>
                      <div>{convertTime(blackMs)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border w-[100%]"></div>
              <div className="p-2">
                <Chessboard
                  id="room-board"
                  position={fen || "start"}
                  onPieceDrop={onDrop}
                />
              </div>
            </div>
            <div className="fixed bottom-4 right-4 w-[350px] border rounded shadow-xl bg-white">
              <div className="h-[45px] border flex items-center justify-center text-xl font-bold">
                Chat
              </div>
              <div className="h-[500px]">
                {messages.map((m) => (
                  <div>{m.text}</div>
                ))}
              </div>
              <div className="h-[80px] border flex items-center justify-between p-4 text-xl">
                <input className="border rounded p-2" />
                <button className="bg-blue-400 p-2 rounded">Send</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
