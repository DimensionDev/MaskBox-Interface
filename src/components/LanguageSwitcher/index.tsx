import { Language, useI18n } from '@/contexts';
import classnames from 'classnames';
import { FC, HTMLProps, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { Icon } from '../Icon';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

const langMap: Record<Language, string> = {
  [Language.En]: 'English',
  [Language.Zh]: '中文',
  [Language.Jp]: '日本語',
};

const langList = Object.keys(Language)
  .filter((l) => isNaN(+l))
  .map((l) => Language[l as keyof typeof Language]);

export const LanguageSwitcher: FC<Props> = ({ className, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useI18n();
  const [menuVisible, setMenuVisible] = useState(false);
  useClickAway(ref, () => {
    setMenuVisible(false);
  });
  return (
    <div
      className={classnames(className, styles.langSwitch)}
      {...rest}
      ref={ref}
      aria-expanded={menuVisible}
    >
      <div className={styles.labels} role="button" onClick={() => setMenuVisible(true)}>
        <Icon type="earth" className={styles.icon} />
        {langMap[language]}
        <Icon type="arrowDown" className={styles.icon} />
      </div>
      {menuVisible && (
        <ul className={styles.langs} role="menu">
          {langList.map((l) => (
            <li
              className={styles.lang}
              key={l}
              role="menuitem"
              onClick={() => {
                setLanguage(l);
                setMenuVisible(false);
              }}
            >
              {langMap[l]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
