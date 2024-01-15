import { useSelector, useDispatch } from "react-redux";
import { questions, answersOptions } from "./helper/data";
import React, { useState, useEffect, useRef } from "react";
import { setAnswer, nextQuestion, resetSurvey } from "./redux/store";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(60);
  const timerRef = useRef<number | null>(null);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const answers = useSelector((state: any) => state.survey.answers);
  const currentQuestion = useSelector(
    (state: any) => state.survey.currentQuestion
  );

  useEffect(() => {
    if (timer === 0 || currentQuestion === questions.length) {
      setSurveyCompleted(true);
    }
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => (prevTimer && prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [surveyCompleted, timer, currentQuestion]);

  useEffect(() => {
    setIsOptionSelected(answers[currentQuestion] !== "");
  }, [answers, currentQuestion]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("surveyAnswers");
    if (savedAnswers) {
      dispatch(resetSurvey());
      const parsedAnswers = JSON.parse(savedAnswers);
      parsedAnswers.forEach((answer: string) => {
        if (answer !== "") dispatch(nextQuestion());
      });
    }
  }, [dispatch]);

  const handleAnswerChange = (answer: string) => {
    const savedAnswers = localStorage.getItem("surveyAnswers");
    const existingAnswers = savedAnswers
      ? JSON.parse(savedAnswers)
      : Array(10).fill("");

    existingAnswers[currentQuestion] = answer;
    localStorage.setItem("surveyAnswers", JSON.stringify(existingAnswers));
    dispatch(setAnswer(answer));
    setIsOptionSelected(true);
  };

  const handleNextQuestion = () => {
    dispatch(nextQuestion());
    setIsOptionSelected(false);
  };

  const handleRetakeSurvey = () => {
    setTimer(60);
    dispatch(resetSurvey());
    setSurveyCompleted(false);
    localStorage.removeItem("surveyAnswers");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 m-8">
        {surveyCompleted ? (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-purple-900">
              Thank you for answering this survey!
            </h1>
            <button
              onClick={handleRetakeSurvey}
              className="bg-purple-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-purple-600 focus:outline-none w-full"
            >
              Retake Survey
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-purple-300">
              Q {currentQuestion + 1}
            </h1>
            <h1 className="text-2xl font-bold mb-6 text-purple-900">
              {questions[currentQuestion]}
            </h1>
            {answersOptions[currentQuestion]?.map((option, index) => (
              <div key={index} className="mb-2">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="answer"
                  value={option}
                  onChange={() => handleAnswerChange(option)}
                  checked={answers[currentQuestion] === option}
                  className="mr-2"
                />
                <label
                  htmlFor={`option-${index}`}
                  className="cursor-pointer font-bold mb-6 text-purple-900"
                >
                  {option}
                </label>
              </div>
            ))}
            <p className="font-bold mb-6 text-purple-900">
              Time remaining: {timer} seconds
            </p>
            <button
              onClick={handleNextQuestion}
              disabled={!isOptionSelected}
              className={`${
                isOptionSelected ? "bg-purple-500" : "bg-gray-300"
              } text-white px-4 py-2 mt-4 rounded-lg ${
                isOptionSelected ? "hover:bg-purple-600" : ""
              } focus:outline-none w-full`}
            >
              {currentQuestion === questions.length - 1
                ? "Finish Survey"
                : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
