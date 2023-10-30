import styled from "styled-components";
import UnderNav from "../components/UnderNav";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";
import { parseCookies } from "nookies";
import { getDmData } from "@/util/ReciveDmUtil";
import { useRouter } from "next/router";


interface GetDmData {
  title: string;
  content: string;
}

export default function ReciveDm() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const refreshToken = cookies["refresh-token"];

  const [DmData, setDmData] = useState<GetDmData>();

  const router = useRouter();
  const dmId = router.query.dmId as string;

  useEffect(() => {
    if (accessToken && dmId) {
      getDmData(accessToken, refreshToken, dmId).then((res) => {
        setDmData(res.data.dm);
      });
    }
  });

  return (
    <>
      <DmWrap>
        <Main>
          <Action>
            <IoIosArrowRoundBack size={40} />
            <Link href="/chat">이전</Link>
          </Action>
          <DmInputData>
            <Title>{DmData?.title}</Title>
            <Content>{DmData?.content}</Content>
          </DmInputData>
        </Main>
        <UnderNav></UnderNav>
      </DmWrap>
    </>
  );
}

const DmWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  position: fixed; /* 모달을 화면에 고정 */
  top: -3%;
  left: 0;
  background: linear-gradient(220deg, #3246ff, #e3ceff, #ff46d1);
  z-index: 9999; /* 다른 요소 위에 나타나도록 z-index 설정 */
`;

const Main = styled.div`
  width: 90%;
  height: 80%;

  background-color: rgba(255, 255, 255, 0.7);

  border-radius: 2em;
`;

const Action = styled.div`
  display: flex;
  align-items: center;

  margin-left: 2vw;
  margin-top: 2vh;
`;

const DmInputData = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 3vh;
  padding-left: 8%;
  padding-right: 8%;
`;

const Title = styled.div`
  width: 100%;
  height: 8vh;

  background-color: rgba(255, 255, 255, 0);

  font-size: 1.6rem;
  font-weight: 900;

  border: none;

  textarea&:focus {
    outline: solid 2px white;
    border-radius: 0.5rem;
  }

  overflow: hidden;
`;

const Content = styled.div`
  margin-top: 1vh;

  width: 100%;
  height: 55vh;

  background-color: rgba(255, 255, 255, 0);

  font-size: 1rem;

  border: none;

  textarea&:focus {
    outline: solid 2px white;
    border-radius: 0.5rem;
  }

  overflow: hidden;
`;
