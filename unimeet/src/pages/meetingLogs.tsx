import Modal from "@/components/Modal";
import UnderNav from "@/components/UnderNav";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

// 조건부 렌더링
export default function MeetingLogs() {
  const [selectedBtn, setSelectedBtn] = useState("");

  const switchiBtn = (BtnName: string) => {
    setSelectedBtn(BtnName);
  };

  return (
    <>
      <Main>
        <SwitchDiv>
          <ReceivedRequestsBtn onClick={() => switchiBtn("received")}>
            받은 신청함
          </ReceivedRequestsBtn>
          <SentRequestsBtn onClick={() => switchiBtn("sent")}>
            보낸 신청함
          </SentRequestsBtn>
        </SwitchDiv>
        {selectedBtn === "received" ? (
          <ReceivedRequests />
        ) : selectedBtn === "sent" ? (
          <SentRequests />
        ) : (
          <ReceivedRequests />
        )}
      </Main>
      <UnderNav />
    </>
  );
}

const Main = styled.div`
  width: 100%;
  max-height: 100%;

  overflow: hidden;
`;

const SwitchDiv = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  height: 5vh;

  gap: 2%;

  margin-top: 8vh;
  padding-left: 2%;
  padding-right: 2%;
`;

const ReceivedRequestsBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 49%;
  height: 5vh;

  border-radius: 1.1rem 1.1rem 0 0;

  background-color: #674ff4;

  color: white;

  font-size: 1.2rem;
  font-weight: 700;
`;

const SentRequestsBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 49%;
  height: 5vh;

  border-radius: 1.1rem 1.1rem 0 0;

  background-color: #674ff4;

  color: white;

  font-size: 1.2rem;
  font-weight: 700;
`;

interface Application {
  id: number;
  title: string;
  sender: { id: number; nickname: string };
}

// 받은 신청함
function ReceivedRequests() {
  const [data, setData] = useState<Application[]>([]);
  const [token, setToken] = useState("");
  const searchUrl = "https://unimeet.duckdns.org/meet-ups";

  useEffect(() => {
    const getRecivedApplication = async () => {
      try {
        setToken(localStorage.getItem("login-token") || " ");
        if (token) {
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.get(`${searchUrl}`, {
            headers,
          });
          setData(response.data.data.meetUps);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getRecivedApplication();
  }, [token]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <MainBox>
      <Article>
        {data &&
          data.map((each, index) => {
            return (
              <Application key={index}>
                <Title>{each.title}</Title>
                <Nickname>{each.sender.nickname}</Nickname>
                <Button>
                  <ViewDetails onClick={() => setIsOpen(true)}>
                    상세보기
                  </ViewDetails>
                  {isOpen && (
                    <ModalWrap>
                      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                        <></>
                      </Modal>
                    </ModalWrap>
                  )}
                </Button>
              </Application>
            );
          })}
      </Article>
    </MainBox>
  );
}

// 보낸 신청함
function SentRequests() {
  return (
    <MainBox>
      <Article></Article>
    </MainBox>
  );
}

// SentRequests, ReceivedRequests 함수 공동 부분 CSS
const MainBox = styled.div`
  position: relative;

  display: flex;
  align-content: center;

  width: 100%;
  height: 77vh;

  background-color: #efe3ff;
  opacity: 0.97;

  overflow-y: scroll;
  overflow-x: hidden;
`;

const Article = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
`;

const Application = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;

  width: 90%;
  height: auto;

  border-bottom: solid 1px #bb8dfb;
`;

const Title = styled.div`
  font-size: 2rem;
`;

const Nickname = styled.div`
  font-size: 1.3rem;
`;

const Button = styled.div`
  display: flex;
  justify-content: right;
`;

const ViewDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 0.5rem;

  width: 5rem;
  height: 1.7rem;

  background-color: #bb8dfb;

  border-radius: 5px;
`;

const ModalWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;

  top: -0vh;

  width: 90%;
  height: 77vh;
`;
