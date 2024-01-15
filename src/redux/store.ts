import { configureStore, createSlice } from "@reduxjs/toolkit";

interface SurveyState {
  currentQuestion: number;
  answers: string[];
}

const initialState: SurveyState = {
  currentQuestion: 0,
  answers: Array(10).fill(""),
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      state.answers[state.currentQuestion] = action.payload;
    },
    nextQuestion: (state) => {
      state.currentQuestion += 1;
    },
    resetSurvey: (state) => {
      state.currentQuestion = 0;
      state.answers = Array(10).fill("");
    },
  },
});

export const { setAnswer, nextQuestion, resetSurvey } = surveySlice.actions;
export const store = configureStore({
  reducer: {
    survey: surveySlice.reducer,
  },
});
