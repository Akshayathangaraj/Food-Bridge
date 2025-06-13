import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n ,t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="d-flex justify-content-end p-2">
      <button
        className="btn btn-outline-primary btn-sm mx-1"
        onClick={() => changeLanguage('en')}
      >
        English
      </button>
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => changeLanguage('ta')}
      >
        தமிழ்
      </button>
    </div>
  );
};

export default LanguageSwitcher;
