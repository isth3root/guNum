// ========== PACKAGES ========== \\
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input, Modal, Select, Tabs } from "antd";
import { LuSwords } from "react-icons/lu";
import { useTranslation } from 'react-i18next';

// ========== COMPONENTS ========== \\
import DuelRequests from "../components/duel/DuelRequests";
import ActiveDuels from "../components/duel/ActiveDuels";
import FinishedDuels from "../components/duel/FinishedDuel";

// ========== TYPES & UTILS ========== \\
import i18n from "../utils/i18n";

// ========== CONTEXTES ========== \\
import AuthContext from "../context/AuthContext";

// ========== HOOKS ========== \\
import { useGetAllUsers } from "../hooks/useGetAllUsers";
import useSendDuelRequest from "../hooks/useSendDuelRequest";

// ========== STYLES ========== \\
import "./duel.css";


const { Option } = Select;
const { TabPane } = Tabs;

const Duels = () => {
  const { t } = useTranslation()
  const [themes] = useState<"PINK" | "DARK" | "PURPLE" | "BLUE">(() => {
    const storedTheme = localStorage.getItem("theme");
    return ["PINK", "DARK", "PURPLE", "BLUE"].includes(storedTheme as any)
      ? (storedTheme as "PINK" | "DARK" | "PURPLE" | "BLUE")
      : "DARK";
  });

  const { getAllUsers, users } = useGetAllUsers();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getAllUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
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
      className={`flex flex-col min-h-screen items-center py-5 ${i18n.language === 'en' ? "font-Teko" : "font-Yekan"} px-5 overflow-hidden
        ${themes === "PINK" ? "bg-themePink text-black" : ""}
        ${themes === "DARK" ? "bg-themeDark text-white" : ""}
        ${themes === "BLUE" ? "bg-themeBlue text-white" : ""}
        ${themes === "PURPLE" ? "bg-themePurple text-white" : ""}
      `}
    >
      <div className="flex justify-center mt-5 mb-10">
        <Link to="/">
          <p className="animate-pulse font-semibold text-2xl underline">{t('Home')}</p>
        </Link>
      </div>

      <div className="flex mb-5">
        <button
          onClick={showModal}
          className="flex gap-2 py-1 bg-blue-500 text-white px-2 font-Teko text-2xl"
        >
          {t('Challenge a Friend')}
          <LuSwords />
        </button>
      </div>

      <Modal
        title={i18n.language === "en" ? "Challenge a Friend" : "دوستتو به چالش بکشون"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={i18n.language === 'en' ? "cancel" : "لغو"}
        okText={i18n.language === 'en' ? "send" : "ارسال"}
      >
        <Input
          dir={i18n.language === 'en' ? "ltr" : "rtl"}
          placeholder={i18n.language === 'en' ? "Enter username" : "آیدی رو وارد کن"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-3"
        />
        <Select
          defaultValue="EASY"
          onChange={(value: "EASY" | "MEDIUM" | "HARD") => setDifficulty(value)}
          className={`w-full ${i18n.language === 'en' ? "" : "rtl"}`}
        >
          <Option value="EASY">{t('Easy')}</Option>
          <Option value="MEDIUM">{t('Medium')}</Option>
          <Option value="HARD">{t('Hard')}</Option>
        </Select>
      </Modal>

      <Tabs
        centered
        defaultActiveKey="1"
        className={i18n.language === 'en' ? "custom-tabs-en select-none" : "custom-tabs-fa select-none"}
      >
        <TabPane tab={i18n.language === 'en' ? "Requests" : "درخواست ها"} key="1">
          <DuelRequests users={users} />
        </TabPane>
        <TabPane tab={i18n.language === 'en' ? "Active Duels" : "دوئل های فعال"} key="2">
          <ActiveDuels users={users} />
        </TabPane>
        <TabPane tab={i18n.language === 'en' ? "Finished Duels" : "دوئل های تمام شده"} key="3">
          <FinishedDuels users={users} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Duels;
