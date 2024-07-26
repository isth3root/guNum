import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input, Modal, Select, Tabs } from "antd";
import AuthContext from "../context/AuthContext";
import { useGetAllUsers } from "../hooks/useGetAllUsers";
import useSendDuelRequest from "../hooks/useSendDuelRequest";
import DuelRequests from "../components/duel/DuelRequests";
import ActiveDuels from "../components/duel/ActiveDuels";
import FinishedDuels from "../components/duel/FinishedDuel";
import { LuSwords } from "react-icons/lu";

import "./duel.css";

const { Option } = Select;
const { TabPane } = Tabs;

const Duels = () => {
  const [themes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(() => {
    const storedTheme = localStorage.getItem("theme");
    return ["PINK", "DARK", "PURPLE", "BLUE"].includes(storedTheme as any)
      ? (storedTheme as "PINK" | "DARK" | "PURPLE" | "BLUE")
      : "DARK";
  });

  const { getAllUsers, users } = useGetAllUsers();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

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

  return (
    <div
      className={`flex flex-col min-h-screen items-center py-5 font-Teko px-5
        ${themes === "PINK" ? "bg-themePink text-black" : ""}
        ${themes === "DARK" ? "bg-themeDark text-white" : ""}
        ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
        ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
      `}
    >
      <div className="flex justify-center mt-5 mb-10">
        <Link to="/">
          <p className="animate-pulse font-semibold text-2xl underline">Home</p>
        </Link>
      </div>

      <div className="flex mb-5">
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

      <Tabs
        centered
        defaultActiveKey="1"
        className="custom-tabs"
      >
        <TabPane tab="Requests" key="1">
          <DuelRequests users={users} />
        </TabPane>
        <TabPane tab="Active Duels" key="2">
          <ActiveDuels users={users} />
        </TabPane>
        <TabPane tab="Finished Duels" key="3">
          <FinishedDuels users={users} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Duels;
