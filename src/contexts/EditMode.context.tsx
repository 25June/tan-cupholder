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
import {
  getContentFromStorage,
  setContentToStorage
} from '@/shared/utils/storage';
import { setCookie, getCookie } from '@/shared/utils/cookies.utils';
import { CookieKey } from '@/constants/storageKey.const';

export interface ModesContextProps {
  isEditorMode?: boolean;
  exitEditorMode: () => void;
  language: string;
  getText: (textKey: string) => Record<string, string>;
  texts: Record<string, string>;
  isLoading: boolean;
}

const ModesContext = createContext<ModesContextProps>({
  isEditorMode: false,
  exitEditorMode: () => {},
  language: 'vi',
  getText: () => ({}),
  texts: {},
  isLoading: false
});

export const ModesProvider = ({ children }: PropsWithChildren) => {
  const [isEditorMode, setEditorMode] = useState<boolean>(false);
  const language = useLocale();
  const { user } = useSession();
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [isLoading, setIsLoaded] = useState<boolean>(true);

  useEffect(() => {
    const content = getContentFromStorage();
    const cacheContent = getCookie(CookieKey.CACHE_CONTENT);
    if (content && cacheContent) {
      setTexts(content);
      setIsLoaded(false);
      return;
    }
    getAllContent()
      .then((content) => {
        const texts = content.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {} as Record<string, string>);
        setTexts(texts);
        setContentToStorage(texts);
        setCookie(CookieKey.CACHE_CONTENT, 'true');
      })
      .finally(() => {
        setIsLoaded(false);
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
      texts,
      isLoading
    }),
    [isEditorMode, language, texts, isLoading] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ModesContext.Provider value={contextValues}>
      {children}
    </ModesContext.Provider>
  );
};

export const useModesContext = () => useContext(ModesContext);
