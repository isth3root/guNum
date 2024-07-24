import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Divider, Input, Spin, Modal, Select } from "antd";

import AuthContext from "../context/AuthContext";

import useDuelRequests from "../hooks/useDuelRequests";
import useActiveDuels from "../hooks/useActiveDuels";
import useFinishedDuels from "../hooks/useFinishedDuels";
import { useGetAllUsers } from "../hooks/useGetAllUsers";
import useSendDuelRequest from "../hooks/useSendDuelRequest";
import useAcceptDuelRequest from "../hooks/useAcceptDuel";
import useDenyDuelRequest from "../hooks/useDenyDuel";

import { DuelRequest, Duel } from "../types";

import { AiOutlineDelete } from "react-icons/ai";
import { LuSwords } from "react-icons/lu";
import useDeleteDuel from "../hooks/useDeleteDuel";

const { Option } = Select;

const Duels = () => {
  const [themes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(() => {
    const storedTheme = localStorage.getItem("theme");
    return (storedTheme as "PINK" | "DARK" | "PURPLE" | "BLUE") || "DARK";
  });

  const { getAllUsers, users } = useGetAllUsers();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const {
    requests,
    loading: loadingRequests,
    refetch: refetchRequests,
  } = useDuelRequests(user!.username);

  const {
    duels: activeDuels,
    loading: loadingActive,
    refetch: refetchActive,
  } = useActiveDuels(user!.username);

  const {
    duels: finishedDuels,
    loading: loadingFinished,
    refetch: refetchFinished,
  } = useFinishedDuels(user!.username);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "EASY"
  );

  const showModal = () => {
    setIsModalVisible(true);
  };
  const { sendDuelRequest } = useSendDuelRequest();

  const handleOk = async () => {
    await sendDuelRequest(user!.username, username, difficulty);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { acceptDuelRequest } = useAcceptDuelRequest();
  const { denyDuelRequest } = useDenyDuelRequest();

  const handleAcceptDuel = async (userId: string) => {
    await acceptDuelRequest(userId);
    refetchRequests();
    refetchActive();
    refetchFinished();
  };

  const handleDeny = async (duelId: string) => {
    await denyDuelRequest(duelId);
    refetchRequests();
    refetchActive();
    refetchFinished();
  };

  const handlePlay = (duel: Duel) => {
    navigate(`/duel/${duel._id}`, { state: { difficulty: duel.difficulty } });
  };

  const { deleteDuel } = useDeleteDuel();

  const handleDeleteDuel = async (duelId: string) => {
    await deleteDuel(duelId);
    refetchRequests();
    refetchActive();
    refetchFinished();
  };

  return (
    <div
      className={`flex flex-col min-h-screen items-center py-5 font-Teko
        ${themes === "PINK" ? "bg-themePink text-black" : ""}
        ${themes === "DARK" ? "bg-themeDark text-white" : ""}
        ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
        ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
      `}
    >
      {/* <ThemeDropdown themes={themes} handleThemeChange={handleThemeChange} /> */}
      <div className="flex justify-center mt-5 mb-10">
        <Link to="/">
          <p className="animate-pulse font-semibold text-2xl underline">Home</p>
        </Link>
      </div>
      <Divider
        style={{ color: "white", fontFamily: "Teko", fontSize: "1.25rem" }}
      >
        Search username
      </Divider>
      <div className="flex">
        <button
          onClick={showModal}
          className="flex gap-2 py-1 bg-blue-500 text-white px-2 font-Teko text-3xl"
        >
          Challenge a Friend
          <LuSwords />
        </button>
      </div>

      <Modal
        title="Challenge a Friend"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Send"
      >
        <Input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-3"
        />
        <Select
          defaultValue="EASY"
          onChange={(value: "EASY" | "MEDIUM" | "HARD") => setDifficulty(value)}
          className="w-full"
        >
          <Option value="EASY">Easy</Option>
          <Option value="MEDIUM">Medium</Option>
          <Option value="HARD">Hard</Option>
        </Select>
      </Modal>

      <Divider
        style={{ color: "white", fontFamily: "Teko", fontSize: "1.25rem" }}
      >
        Requests
      </Divider>
      {loadingRequests ? (
        <Spin />
      ) : (
        <div className="flex flex-col gap-5">
          {requests.map((request: DuelRequest) => (
            <div
              key={request._id}
              className="flex flex-col font-Teko px-16 justify-between items-center border-b-2 w-full bg-white py-5 text-black"
            >
              <h1 className="text-2xl">{request.difficulty}</h1>
              <div className="flex justify-center items-center w-full gap-40">
                <h1 className="text-4xl max-w-30 overflow-hidden">
                  {users.find((user) => user._id === request.sender)?.username}
                </h1>
              </div>
              <div className="flex gap-10 mt-4 items-center">
                <button
                  onClick={() => handleAcceptDuel(request._id)}
                  className="text-2xl bg-greenWinner text-white px-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDeny(request._id)}
                  className="text-2xl bg-redLoser text-white px-2"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Divider
        style={{ color: "white", fontFamily: "Teko", fontSize: "1.25rem" }}
      >
        Active Duels
      </Divider>

      {loadingActive ? (
        <Spin />
      ) : (
        <div className="flex flex-col gap-5">
          {activeDuels.map((duel: Duel) => {
            const isDisabled =
              (duel.sender === user?._id && !!duel.senderGuesses) ||
              (duel.receiver === user?._id && !!duel.receiverGuesses);
            return (
              <div
                key={duel._id}
                className="flex flex-col font-Teko px-14 justify-between items-center border-b-2 w-full bg-white py-5 text-black"
              >
                <h1 className="text-2xl">{duel.difficulty}</h1>
                <div className="flex justify-between gap-10 w-full">
                  <h1 className="text-3xl">
                    {users.find((user) => user._id === duel.sender)?.username}
                  </h1>
                  <h1 className="text-3xl">
                    {users.find((user) => user._id === duel.receiver)?.username}
                  </h1>
                </div>
                <div className="flex items-center gap-3 text-2xl">
                  <h1>{duel.senderGuesses}</h1> :{" "}
                  <h1>{duel.receiverGuesses}</h1>
                </div>
                <div className="flex gap-10 mt-4 px-14 items-center">
                  <button
                    className={`text-2xl px-4 ${
                      isDisabled
                        ? "bg-greyTie text-gray-500 cursor-not-allowed"
                        : "bg-greenWinner text-white"
                    }`}
                    onClick={() => handlePlay(duel)}
                    disabled={isDisabled}
                  >
                    {isDisabled ? "Played" : "Play"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Divider
        style={{ color: "white", fontFamily: "Teko", fontSize: "1.25rem" }}
      >
        Finished Duels
      </Divider>

      {loadingFinished ? (
        <Spin />
      ) : (
        <div className="flex flex-col gap-5 font-Teko">
          {finishedDuels.map((duel: Duel) => (
            <div
              key={duel._id}
              className={`relative flex flex-col justify-between items-center border-b-4 w-full px-2 py-2 ${
                duel.winner
                  ? user?._id === duel.winner
                    ? "bg-greenWinner text-black"
                    : "bg-redLoser text-white"
                  : "bg-greyTie text-black"
              }`}
            >
              <div className="absolute top-1 right-1 text-black text-2xl">
                <AiOutlineDelete
                  onClick={() => handleDeleteDuel(duel._id)}
                  className="cursor-pointer hover:text-red-500"
                />
              </div>
              <h1 className="text-2xl">{duel.difficulty}</h1>
              <div className="flex justify-between w-full gap-40">
                <h1 className="text-3xl max-w-20 overflow-hidden">
                  {users.find((user) => user._id === duel.sender)?.username}
                </h1>
                <h1 className="text-3xl max-w-20 overflow-hidden">
                  {users.find((user) => user._id === duel.receiver)?.username}
                </h1>
              </div>
              <div className="flex gap-3 items-center">
                <h1 className="text-3xl">{duel.senderGuesses}</h1> :{" "}
                <h1 className="text-3xl">{duel.receiverGuesses}</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Duels;
