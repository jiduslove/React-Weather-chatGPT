import axios from "axios";
import { useState } from "react";

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitChat = async (e) => {
    try {
      e.preventDefault();

      if (isLoading) {
        alert("검색중입니다...");

        return;
      }
      if (!question) {
        alert("질문을 입력해주세요.");

        return;
      }

      setIsLoading(true);
      setContent("");

      const response = await axios.post(
        "https://holy-fire-2749.fly.dev/chat",
        {
          question, //   question: `${question}`, question: question,  question, 이렇게 3가지는 다 같은표현
        },
        {
          headers: {
            Authorization: "Bearer BLOCKCHAINSCHOOL3",
          },
        }
      );

      if (response.status !== 200) {
        alert("오류가 발생했습니다.");
        setIsLoading(false);

        return;
      }

      console.log(response);
      setContent(response.data.choices[0].message.content);

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center text-white">
      <form onSubmit={onSubmitChat}>
        <input
          className="text-black"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)} //onchange라는 함수인데 e(이벤트)가 발생한다. on시리즈에는 e를 항상 써도된다.
        />{" "}
        {/* onChange={(e) => setQuestion(e.target.value)를 작성한 이유가 useState에 있는 값을 우리가 입력한 값으려 변경해주기 위해서 e.target.value가 있는것이다. */}
        <input type="submit" value="검 색" />
      </form>
      {content && <div className="mt-4 px-16">{content}</div>}
    </div>
  );
};

export default Chat;
