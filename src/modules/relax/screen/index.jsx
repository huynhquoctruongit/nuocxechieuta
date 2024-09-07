import Loading, { LoadingPage } from "@/components/widget/loading";
import useQuestion from "../helper/use-question";
import { AnimatePresence, motion } from "framer-motion";
import { cn, enumFood } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createImage } from "@/lib/helper";
import useImage from "@/modules/order/helper/use-image";
import UserProfile from "@/components/widget/user";
import { Button } from "@/components/common/button-hero";
import { ChevronsRightIcon } from "lucide-react";
import AxiosClient from "@/lib/api/axios-client";
import { useAuth } from "@/hooks/use-auth";
import ListUserPoint from "../component/list-user-point";
import useSWR from "swr";

const Relax = () => {
  const { isLoading, getNextQuestion, questions } = useQuestion();
  const [question, setQuestion] = useState();
  const [isEnd, setIsEnd] = useState(false);

  const getNext = () => {
    if (questions.length === 0) return;
    const index = getNextQuestion();
    if (index === -1) setIsEnd(true);
    setQuestion(questions[index]);
  };
  useEffect(() => {
    if (questions.length === 0) return;
    getNext();
  }, [questions]);

  if ((isLoading || !question) && !isEnd) return <LoadingPage />;

  return (
    <motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="root-wrapper text-left relative my-10"
      >
        <div className="absolute top-1/3 left-0 bg-pastel-pink/20  blur-xl w-72 h-72 rounded-full"></div>
        <div className="absolute top-2/3 left-1/2 bg-secondary-01/10  blur-[100px] w-96 h-96 rounded-full"></div>
        <div className="flex items-stretch gap-10 mt-10 relative z-10 flex-wrap md:flex-nowrap">
          <div className="w-full md:w-7/12 ">
            {isEnd && (
              <div className="border flex items-center justify-center flex-col h-full min-h-[500px] border-primary-01 rounded-xl p-6 bg-white ring-[6px] ring-primary-01/5 ring-offset-0">
                <img src="/images/not-found.png" alt="" className="w-40 h-40 object-contain" />
                <div className="text-gray-600">Làm gì mà làm dữ ác dị 🤬</div>
                <div className="text-primary-01">Nghĩ ngơi đi FEN</div>
              </div>
            )}
            {!isEnd && <Question question={question} key={question.id} getNext={getNext} />}
          </div>
          <div className="w-full md:w-5/12 border border-primary-01 rounded-xl p-6">
            <div className="text-primary-01 text-xl font-bold">Cẩn thận với các người chơi này</div>
            <div className="mt-4 flex flex-col gap-4">
              <ListUserPoint />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default Relax;

const getStatistic = async (userId) => {
  const data = await AxiosClient.get("/items/statictis_user?filter[user][_eq]=$CURRENT_USER");
  const staticUser = data.data[0];
  if (staticUser) return staticUser;
  const statics = await AxiosClient.post("/items/statictis_user", {
    user: userId,
    point: 0,
  });
  return statics.data;
};

const enumApa = ["A", "B", "C", "D"];

const Question = ({ question, getNext }) => {
  const [active, setActive] = useState(null);
  const { data: statics, mutate: mutateStatics } = useSWR("/items/statictis_user?filter[user][_eq]=$CURRENT_USER");
  const staticUser = statics?.data[0] || { point: 0, count_correct: 0, count_incorrect: 0 };

  const { profile } = useAuth();
  const { createAnswer } = useQuestion();
  const onClick = async (option) => {
    if (active) return;
    setActive(option);
    const point = option.is_correct ? 5 : 0;
    const staticUser = await getStatistic(profile.id);
    await createAnswer({
      question: question.id,
      detail: option,
      is_correct: option.is_correct,
      point: option.is_correct ? 5 : 0,
    });
    await AxiosClient.patch(`/items/statictis_user/${staticUser.id}`, {
      point: staticUser.point + point,
      count_correct: staticUser.count_correct + (option.is_correct ? 1 : 0),
      count_incorrect: staticUser.count_incorrect + (option.is_correct ? 0 : 1),
    });
    mutateStatics();
  };
  const { data } = useImage("juice");
  const enumJuice = data.map((item) => item.directus_files_id);
 
  return (
    <div className="border h-full min-h-[500px] flex flex-col border-primary-01 rounded-xl p-6 bg-white ring-[6px] ring-primary-01/5 ring-offset-0">
      <div className="flex gap-10 flex-wrap md:flex-nowrap items-start">
        <div className="text-primary-01 w-full md:w-10/12">   
          <div className="text-lg font-bold text-gray-600">Món quà: {question.topic.name}</div>
          <div>{question.content}</div>
        </div>
        <div className="w-full md:w-2/12">
          <img
            src={createImage(question.image || "4ff542bd-bbbb-4ee2-809a-f941e05b2605", 500)}
            alt=""
            className="w-40 h-full object-contain mx-auto md:mx-0"
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-10 flex-wrap">
        {question?.options?.map((option, index) => {
          const itemActive = enumJuice[index % enumJuice.length];
          return (
            <div key={option.id} className="flex gap-x-4 items-start gap-y-1 cursor-pointer ">
              <div className="min-w-10 w-10">{enumApa[index]}.</div>
              <div>
                <div
                  onClick={() => onClick(option)}
                  className={cn(
                    "text-sm rounded-full w-fit hover:shadow-lg hover:shadow-primary-01/10 duration-200 px-3 py-1 border-dashed border-pastel-pink border ",
                    { "bg-secondary-01 text-white border-secondary-01": active && active?.id === option.id && option.is_correct },
                    { "bg-primary-01 text-white border-primary-01": active && active?.id === option.id && !option.is_correct },
                  )}
                >
                  {option.label} {active && active?.id === option.id && (option.is_correct ? "👍" : "👎")}
                </div>
                <motion.div
                  className={cn("text-xs mt-1 ml-2 opacity-0 duration-200 hidden md:block", {
                    "text-green-700 opacity-100": option.is_correct && active,
                    "text-gray-500 opacity-100": !option.is_correct && active,
                  })}
                >
                  {option.explanation}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 mt-8 text-primary-01">
        {question.fact && active && <div className="text-primary-01"> Fact: {question.fact}</div>}
        {question.insight && active && <div className="text-secondary-01"> Insight: {question.insight}</div>}
      </div>

      <div className="flex justify-between mt-auto gap-6 pt-10 flex-wrap">
        <div>
          Điểm hiện tại:{" "}
          <span className="border border-dashed border-primary-01 px-2 py-1 rounded-full text-primary-01 font-bold">
            {staticUser.point}
          </span>
        </div>
        <Button className="flex items-center gap-2" onClick={getNext}>
          Câu tiếp đê <ChevronsRightIcon className="w-4" />
        </Button>
      </div>
    </div>
  );
};
