import { Button, Icon } from '@/components';
import { RouteKeys } from '@/configs';
import classnames from 'classnames';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './index.module.less';
import { useLocales } from './useLocales';

const boxUrl = new URL('../../assets/images/box.png', import.meta.url).href;
const nftUrl = new URL('../../assets/images/nft.png', import.meta.url).href;
const kvUrl = new URL('../../assets/images/kv.png', import.meta.url).href;

export const Home: FC = () => {
  const t = useLocales();
  const history = useHistory();
  return (
    <main>
      <div className={classnames(styles.frame, styles.heroFrame)}>
        <div className={styles.content}>
          <h2 className={styles.title}>{t('Time to enjoy NFT Mystery on chain !')}</h2>
          <p className={styles.description}>{t('description1')}</p>
          <Button
            colorScheme="primary"
            size="large"
            rightIcon={<Icon type="chevronRight" size={22} />}
            onClick={() => {
              history.push(RouteKeys.BoxList);
            }}
          >
            {t('Explore Now')}
          </Button>
        </div>
      </div>

      <div className={classnames(styles.frame, styles.rightFrame)}>
        <div className={styles.content}>
          <div className={styles.image}>
            <img src={boxUrl} alt="box" loading="lazy" />
          </div>
          <div className={styles.texts}>
            <h2 className={styles.title}>{t('Mint your NFT Mystery with a suitbale gas fee')}</h2>
            <p className={styles.description}>{t('description2')}</p>
          </div>
        </div>
      </div>

      <div className={classnames(styles.frame, styles.leftFrame)}>
        <div className={styles.content}>
          <div className={styles.image}>
            <img src={nftUrl} alt="box" loading="lazy" />
          </div>
          <div className={styles.texts}>
            <h2 className={styles.title}>{t('Multi-chains NFT Mystery publishing')}</h2>
            <p className={styles.description}>{t('description3')}</p>
          </div>
        </div>
      </div>

      <div className={classnames(styles.frame, styles.rightFrame)}>
        <div className={styles.content}>
          <div className={styles.image}>
            <img src={kvUrl} alt="box" loading="lazy" />
          </div>
          <div className={styles.texts}>
            <h2 className={styles.title}>{t('Publish your own NFT Mystery')}</h2>
            <p className={styles.description}>{t('description4')}</p>
          </div>
        </div>
      </div>
    </main>
  );
};
