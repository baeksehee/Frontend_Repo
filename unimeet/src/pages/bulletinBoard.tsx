import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import UnderNav from "@/components/UnderNav";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  state: string;
  maxPeople: number;
  gender: string;
  profileImageUrl: string;
  nickname: string;
  likes: number;
}

export default function BulletinBoard() {
  const [data, setData] = useState<Post[]>([]);
  const [token, setToken] = useState("");
  const searchUrl = "https://unimeet.duckdns.org/posts";

  useEffect(() => {
    const getPostsData = async () => {
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
          setData(response.data.data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPostsData();
  }, [token]);

  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const ClickLike = async (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: number
  ) => {
    e.preventDefault();
    try {
      setToken(localStorage.getItem("login-token") || " ");
      if (token) {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        await axios.put(
          `https://unimeet.duckdns.org/posts/${postId}/like`,
          "게시글 좋아요",
          { headers }
        );

        // 좋아요한 포스트의 ID를 관리하는 상태 업데이트
        if (likedPosts.includes(postId)) {
          setLikedPosts(likedPosts.filter((id) => id !== postId));
        } else {
          setLikedPosts([...likedPosts, postId]);
        }

        const updatedResponse = await axios.get(`${searchUrl}`, {
          headers,
        });
        setData(updatedResponse.data.data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MainBox>
        <Article>
          {data &&
            data.map((each, index) => {
              return (
                <Post key={index}>
                  <Link
                    href={{ pathname: "/detailBoard", query: { id: each.id } }}
                  >
                    <Writer>
                      <ProfileImageWrap>
                        <ProfileImage
                          src={each.profileImageUrl}
                          alt="작성자 이미지 사진"
                        ></ProfileImage>
                      </ProfileImageWrap>
                      <Name>{each.nickname}</Name>
                    </Writer>
                    {each.imageUrl !== "" && (
                      <PictureWrap>
                        <PictureImage
                          src={each.imageUrl}
                          alt="게시글 첨부 사진"
                        ></PictureImage>
                      </PictureWrap>
                    )}
                    <WritingBox>
                      <Title>{each.title}</Title>
                      <Text>{each.content}</Text>
                    </WritingBox>
                    <ReactionBox>
                      <HeartWrap onClick={(e) => ClickLike(e, each.id)}>
                        {likedPosts.includes(each.id) ? (
                          <StyledLikedHeartIcon />
                        ) : (
                          <StyledHeartIcon />
                        )}
                        <LikesCount>{each.likes}</LikesCount>
                      </HeartWrap>
                      {/* <CommentWrap>
                    <Comment src="/comment.png" alt="댓글" />
                  </CommentWrap> */}
                    </ReactionBox>
                  </Link>
                </Post>
              );
            })}
        </Article>
      </MainBox>
      <UnderNav />
    </>
  );
}

const MainBox = styled.div`
  display: flex;
  align-content: center;

  margin-top: 5vh;
  padding-bottom: 10vh;

  width: 100%;
  height: auto;

  background-color: #efe3ff;
`;

const Article = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  min-height: 95vh;
  // 0.몇으로 하면 자동적으로 길이가 길어짐에 따라(100vh를 넘었을 때) 색의 경계선이 보임
`;

const Post = styled.div`
  width: 100%;
  height: auto;

  border-bottom: solid 1px #bb8dfb;
`;

const Writer = styled.div`
  display: flex;
  align-items: center;

  padding-top: 2vh;
  padding-bottom: 1%;
  padding-left: 3%;

  width: 100%;
  height: 9vh;
`;

const ProfileImageWrap = styled.div`
  width: 50px;
  height: 50px;

  border-radius: 50%;
  background-color: pink;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;

  border-radius: 50%;
`;

const Name = styled.div`
  padding-left: 2%;

  font-size: 1.2rem;
  font-weight: 600;
`;

const PictureWrap = styled.div`
  margin-left: 3%;
  display: flex;
  justify-content: center;

  width: 93.5%;
  height: 18vh;

  background-color: #ebedfa;
`;

const PictureImage = styled.img`
  width: 50%;
  height: 100%;

  border-radius: 5px;

  background-color: blue;
`;

const WritingBox = styled.div`
  padding-top: 1%;
  padding-bottom: 1vh;

  padding-left: 3%;
  padding-right: 3%;
`;

const Title = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
`;

const Text = styled.div`
  font-size: 1.1rem;
  margin-top: 0.5vh;
`;

const ReactionBox = styled.div`
  display: flex;

  padding-bottom: 2vh;

  width: 100%;
  height: 6vh;
`;

const HeartWrap = styled.button`
  display: flex;
  align-items: center;

  margin-left: 3%;

  width: 11%;
  height: 3.8vh;

  background-color: #efe3ff;
  border: none;
`;

const StyledHeartIcon = styled(AiOutlineHeart)`
  font-size: 2.5rem;
`;

const StyledLikedHeartIcon = styled(AiFillHeart)`
  font-size: 2.5rem;
`;

const LikesCount = styled.div`
  margin-left: 0.5%;
  font-size: 1rem;
`;

// const CommentWrap = styled.div`
//   margin-left: 3%;

//   width: 7%;
//   height: 3.5vh;
// `;

// const Comment = styled.img`
//   width: 100%;
//   height: 100%;
// `;
