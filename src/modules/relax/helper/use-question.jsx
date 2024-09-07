import AxiosClient from "@/lib/api/axios-client";
import useSWR from "swr";

function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((item) => !set2.has(item));
}

const useQuestion = () => {
  const { data, isLoading } = useSWR("/items/question?fields=*,options.*,topic.name");
  const {
    data: answer,
    isLoading: isLoadingAnswer,
    mutate: mutateAnswer,
  } = useSWR("/items/answer?filter[user_created][_eq]=$CURRENT_USER");
  const questions = data?.data || [];
  const listAnswer = answer?.data || [];

  const getNextQuestion = () => {
    const questionValid = difference(questions, listAnswer);
    if (questionValid.length === 0) return -1;
    const randomIndex = Math.floor(Math.random() * questionValid.length);
    const question = questionValid[randomIndex];
    const index = questions.findIndex((item) => item.id === question.id);
    return index;
  };
  const createAnswer = async (payload) => {
    await AxiosClient.post("/items/answer", payload);
    mutateAnswer(
      (oldData) => {
        const newData = [...oldData.data, payload];
        return { data: newData };
      },
      { revalidate: false },
    );
  };

  return {
    questions: questions,
    isLoading: isLoading || isLoadingAnswer,
    createAnswer,
    getNextQuestion,
  };
};

export default useQuestion;
