import { useEffect, useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { Button, Modal } from '../components/atom';
import { auth } from '../data';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { TierAdmin, VoteAdmin } from '../components/DecisionPhase';
import Loading from '../components/Loading';

const DecisionPhase = () => {
  const [gameType, setGameType] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [pw, setPw] = useState('');
  const [isShowAdminModal, setIsShowAdminModal] = useState(true);
  const [isShowStartModal, setIsShowStartModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //* Admin 퇴장 데이터 송신
  useEffect(() => {
    if (isLogin) {
      const db = getDatabase();
      const adminRef = ref(db, `/activeAdmin`);
      return () => {
        push(adminRef, {
          join: false,
          type: null,
          createAt: Date.now(),
        });
      };
    }
  }, [isLogin]);

  useEffect(() => {
    //* 어드민 로그인 확인
    setIsLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user?.email === 'less0805@gmail.com') {
        setIsLogin(true);
        setIsShowAdminModal(false);
        setIsShowStartModal(true);
        setIsLoading(false);
      } else {
        setIsShowAdminModal(true);
        setIsLoading(false);
      }
    });
  }, []);

  const adminHandler = async () => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, 'less0805@gmail.com', pw);
      setIsLoading(false);
      setIsShowAdminModal(false);
      setIsShowStartModal(true);
      setIsLogin(true);
    } catch (error) {
      alert('비밀번호가 잘못되었습니다.');
      setIsLoading(false);
    }
  };

  const joinHander = ({ target: { name } }) => {
    if (isLogin) {
      const db = getDatabase();
      const adminRef = ref(db, `/activeAdmin`);

      push(adminRef, {
        join: true,
        type: name,
        createAt: Date.now(),
      });
      setGameType(name);
      setIsShowStartModal(false);
    } else alert('비정상적인 접근입니다. 비밀번호를 입력하여 접속하세요.');
  };

  return (
    <>
      {isShowStartModal && (
        <Modal>
          <div className="window">
            <h2 className="desc">admin ready</h2>
            <div className="btns">
              <Button name="vote" onClick={joinHander}>
                vote
              </Button>
              <Button name="tier" onClick={joinHander}>
                tier
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {isShowAdminModal && (
        <Modal>
          <div
            className="window"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {isLoading && <Loading />}
            <h2 className="desc">password</h2>
            <input
              type="password"
              value={pw}
              onKeyUp={({ key }) => {
                if (key === 'Enter') adminHandler();
              }}
              onChange={({ target: { value } }) => {
                setPw(value);
              }}
            />
            <Button onClick={adminHandler}>login</Button>
          </div>
        </Modal>
      )}
      {gameType === 'vote' ? (
        <VoteAdmin />
      ) : gameType === 'tier' ? (
        <TierAdmin />
      ) : (
        <div />
      )}
    </>
  );
};

export default DecisionPhase;
