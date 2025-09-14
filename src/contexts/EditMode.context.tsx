'use client';

import {
  createContext,
  useState,
  useMemo,
  useContext,
  useCallback,
  PropsWithChildren,
  useEffect
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { getAllContent } from '@/app/lib/public-content.actions';

export interface ModesContextProps {
  isEditorMode?: boolean;
  exitEditorMode: () => void;
  language: string;
  changeLanguage: (value: string) => void;
  getText: (textKey: string) => Record<string, string>;
  texts: Record<string, string>;
}

const ModesContext = createContext<ModesContextProps>({
  isEditorMode: false,
  exitEditorMode: () => {},
  language: 'vn',
  changeLanguage: () => {},
  getText: () => ({}),
  texts: {}
});

export const ModesProvider = ({ children }: PropsWithChildren) => {
  const [isEditorMode, setEditorMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('vn');
  // Check if user is signed in to enable editor mode hotkeys
  const [isSignedIn, setIsSignedIn] = useState<boolean>(true);
  const [texts, setTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    // const checkAuth = async () => {
    //   try {
    //     const token = document.cookie.includes('authjs.session-token');
    //     console.log({ token });
    //     setIsSignedIn(!!token);
    //   } catch (error) {
    //     setIsSignedIn(false);
    //   }
    // };

    // checkAuth();
    getAllContent().then((content) => {
      setTexts(
        content.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {} as Record<string, string>)
      );
    });
  }, []);

  useHotkeys(
    'ctrl+u,ctrl+alt+u',
    () => {
      console.log('Enable/Disable editor mode');
      setEditorMode((v) => !v);
    },
    { enabled: isSignedIn }
  );

  const exitEditorMode = useCallback(() => setEditorMode(false), []);
  const changeLanguage = useCallback((value: string) => setLanguage(value), []);
  const getText = useCallback((textKey: string) => {
    return texts[textKey] ? JSON.parse(texts[textKey]) : { vn: '', en: '' };
  }, []);

  const contextValues = useMemo(
    () => ({
      isEditorMode,
      exitEditorMode,
      language,
      changeLanguage,
      getText,
      texts
    }),
    [isEditorMode, language, texts] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ModesContext.Provider value={contextValues}>
      {children}
    </ModesContext.Provider>
  );
};

export const useModesContext = () => useContext(ModesContext);
