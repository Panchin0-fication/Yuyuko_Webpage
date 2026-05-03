import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Profile, Message, type userData, type withUserData } from "@shared";

//To check if the user is logged in and forbid the entry to a page
type props = {
  setUserData?: React.Dispatch<React.SetStateAction<userData | null>> | null;
};
export default function ValidateSesion({ setUserData = null }: props) {
  const { t } = useTranslation("common");

  const [message, setMessage] = useState<null | ReactNode>(null);
  useEffect(() => {
    const validation = async () => {
      const res = (await Profile(
        localStorage.getItem("token"),
      )) as withUserData;
      if (!res.success) {
        setMessage(
          <Message
            header={t("message_header_no_loged_in")}
            text={t("message_body_no_loged_in")}
            setMessage={setMessage}
            toRedirect={"/auth/login"}
            type="error"
            previus={{ state: { from: location.pathname } }}
          />,
        );
        //If the user wants to get user info
      } else {
        if (!setUserData) return;
        setUserData(res.user_data);
      }
    };
    validation();
  }, []);
  return <>{message}</>;
}
