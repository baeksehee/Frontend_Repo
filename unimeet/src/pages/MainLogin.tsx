import styled, { keyframes } from "styled-components";
import { AiOutlineUser } from "react-icons/ai";
import { BiLockAlt } from "react-icons/bi";
import Link from "next/link";
import BubbleGround from "@/components/BubbleGround";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { parseCookies, setCookie } from "nookies";
import { isMobile } from "react-device-detect";

export default function MainLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  function loginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    axios
      .post("https://unimeet.duckdns.org/auth/sign-in", {
        email,
        password,
      })
      .then((res) => {
        const accessToken = res.data.data.accessToken;
        const refreshToken = res.data.data.refreshToken;
        localStorage.setItem("accessToken", accessToken);
        setCookie(null, "accessToken", accessToken, {
          maxAge: 30 * 24 * 60 * 60, // 30일
          path: "/", // 쿠키 경로
        });
        setCookie(null, "refresh-token", refreshToken, {
          maxAge: 30 * 24 * 60 * 60, // 30일
          path: "/", // 쿠키 경로
        });
        router.push("/bulletinBoard");
      })
      .catch((err) => {
        alert("아이디 또는 비밀번호가 틀렸습니다.");
      });
  }
  useEffect(() => {
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    if (accessToken) {
      router.push("/bulletinBoard");
    }
    if(isMobile){
      alert("모바일 환경만 지원하고 있습니다.")
    }
  });

  return (
    <>
      {isMobile && (
        <Main>
          <BubbleGround />
          <LoginBox>
            <form onSubmit={loginSubmit}>
              <TextBox>
                <AiOutlineUser color="gray" />
                <input
                  placeholder="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </TextBox>
              <TextBox>
                <BiLockAlt color="gray" />
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </TextBox>
              <ButtonDiv>
                <ButtonStyle type="submit">login</ButtonStyle>
                <Link href="/signup">
                  <ButtonStyle>signup</ButtonStyle>
                </Link>
              </ButtonDiv>
            </form>
          </LoginBox>
        </Main>
      )}
    </>
  );
}
const pulse = keyframes`
 0% {
  box-shadow: 0 0 0 0 #05bada66;
 }

 70% {
  box-shadow: 0 0 0 10px rgb(218 103 68 / 0%);
 }

 100% {
  box-shadow: 0 0 0 0 rgb(218 103 68 / 0%);
 }
`;
const ButtonDiv = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
export const ButtonStyle = styled.button`
  border: none;
  color: #fff;
  background-image: linear-gradient(30deg, #a600ff, #4ce3f7);
  border-radius: 20px;
  background-size: 100% auto;
  font-family: inherit;
  font-size: 17px;
  padding: 0.6em 1.5em;
  &:hover {
    background-position: right center;
    background-size: 200% auto;
    -webkit-animation: pulse 2s infinite;
    animation: ${pulse} 1.5s infinite;
  }
`;
const TextBox = styled.div`
  width: 18rem;
  height: 3rem;
  font-size: 1.5rem;
  border-radius: 30px;
  border: 0px;
  margin-top: 1rem;
  padding: 0px 1rem;
  background: white;
  display: flex;
  align-items: center;

  & > input {
    border: 0px;
    height: -webkit-max-content;
    height: -moz-max-content;
    height: 90%;
    width: 100%;
    padding: 0px 1rem;
    outline: none;
    background-color: white;
  }
`;
export const LoginBox = styled.div`
  width: 20rem;
  height: 25rem;
  border-radius: 50px;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 1rem;
  flex-direction: column;
  backdrop-filter: blur(10px);
  box-shadow: 0px 0px 16px #686868;
`;
const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;
