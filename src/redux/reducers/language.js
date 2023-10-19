import { LANGUAGE } from "../../constants";
import EN from "../../data/en";
import UZ from "../../data/uz";
import { SWITCH_LANGUAGE } from "../types/language";

const languages = {
  uz: UZ,
  en: EN,
};

const languageType = localStorage.getItem(LANGUAGE) || "en";

const initialState = {
  languageType,
  language: languages[languageType],
};

const languageReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SWITCH_LANGUAGE:
      localStorage.setItem(LANGUAGE, payload);
      return { languageType: payload, language: languages[payload] };
  }
  return state;
};

export default languageReducer;
