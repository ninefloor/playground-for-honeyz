import { auth, firestore } from "@utils/firebase";
import userInfo from "@utils/userInfo";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

/**
 * useLogin: 로그인 로직을 위한 훅
 * @type {Function}
 * @param {string} location - 로그인 후 경로 이동이 필요하다면 작성.
 * @return {object} email, emailHandler, pw, pwHander, isLoading, loginHander
 */

const useLogin = (location: string | undefined) => {
  const [email, setEmail] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const setUserInfo = useSetRecoilState(userInfo);

  const emailHandler = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setEmail(value);
  };

  const pwHander = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setPw(value);
  };

  const loginHander = async () => {
    try {
      setIsLoading(true);
      const data = await signInWithEmailAndPassword(auth, email, pw);
      const userId = data.user.uid;
      const docRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(docRef);
      const userData = userDoc.data();
      if (userData) setUserInfo({ userId, name: userData.name });
      setIsLoading(false);
      if (location) navigate(location);
    } catch (error) {
      console.log(error);
      alert("아이디나 비밀번호가 잘못되었습니다.");
      setIsLoading(false);
    }
  };

  return { email, emailHandler, pw, pwHander, isLoading, loginHander };
};

export default useLogin;
