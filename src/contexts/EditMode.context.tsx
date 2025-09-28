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
import { useLocale } from 'next-intl';
import { useSession } from '@/hooks/useSession';

export interface ModesContextProps {
  isEditorMode?: boolean;
  exitEditorMode: () => void;
  language: string;
  getText: (textKey: string) => Record<string, string>;
  texts: Record<string, string>;
}

const ModesContext = createContext<ModesContextProps>({
  isEditorMode: false,
  exitEditorMode: () => {},
  language: 'vi',
  getText: () => ({}),
  texts: {}
});

export const ModesProvider = ({ children }: PropsWithChildren) => {
  const [isEditorMode, setEditorMode] = useState<boolean>(false);
  const language = useLocale();
  const { user } = useSession();
  const [texts, setTexts] = useState<Record<string, string>>({});

  useEffect(() => {
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
    { enabled: !!user?.email }
  );

  const exitEditorMode = useCallback(() => setEditorMode(false), []);
  const getText = useCallback(
    (textKey: string) => {
      return texts[textKey] ? JSON.parse(texts[textKey]) : { vi: '', en: '' };
    },
    [texts]
  );

  const contextValues = useMemo(
    () => ({
      isEditorMode,
      exitEditorMode,
      language,
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
