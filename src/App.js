import React, { useState } from 'react';
import LanguageSwitch from './components/LanguageSwitch';
import { translations } from './i18n/translations';
import HomeScreen from './screens/HomeScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import PuzzleScreen from './screens/PuzzleScreen';
import SocialScreen from './screens/SocialScreen';
import { useSocialState } from './state/useSocialState';

export default function App() {
  const [language, setLanguage] = useState('zh');
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);
  const social = useSocialState();

  const goHome = () => {
    setPage('home');
    setSelected(null);
    social.setActiveTopic(null);
  };

  const confirmSelection = () => {
    if (selected) {
      setPage(selected.id);
      setSelected(null);
      social.setSocialTab('topics');
      social.setActiveTopic(null);
    }
  };

  const shared = {
    language,
    t: translations[language],
    switchLanguage: <LanguageSwitch language={language} setLanguage={setLanguage} />,
    goHome,
  };

  if (page === 'home') {
    return <HomeScreen {...shared} selected={selected} setSelected={setSelected} confirmSelection={confirmSelection} />;
  }
  if (page === 'puzzle') return <PuzzleScreen {...shared} />;
  if (page === 'social') return <SocialScreen {...shared} social={social} />;
  return <PlaceholderScreen {...shared} page={page} />;
}
