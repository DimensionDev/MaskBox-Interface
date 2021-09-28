import { logoImage } from '@/assets';
import { Icon, NeonButton } from '@/components';
import { useMBoxContract, useWeb3Context } from '@/contexts';
import { getNetworkIcon, getNetworkName, selections } from '@/lib';
import { formatAddres } from '@/utils';
import classnames from 'classnames';
import { FC, HTMLProps, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SelectNetwork } from '../SelectNetwork';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {}

export const PageHeader: FC<Props> = ({ className, ...rest }) => {
  const { account, providerChainId, connectWeb3 } = useWeb3Context();
  const [selectNetworkVisible, setSelectNetworkVisible] = useState(false);
  const { collectionId, setMbox } = useMBoxContract();
  return (
    <div className={classnames(styles.pageHeader, className)} {...rest}>
      <div className={styles.brand}>
        <Link to="/" className={styles.logo} title="NFTBOX">
          <img src={logoImage} height="36" width="36" alt="NFTBOX" />
        </Link>
        <select
          value={collectionId}
          onChange={(ev) =>
            setMbox((state) => ({
              ...state,
              collectionId: parseInt(ev.target.value),
            }))
          }
        >
          {selections.map((sel) => (
            <option key={sel.id} value={sel.id}>
              {sel.name}
            </option>
          ))}
        </select>
      </div>
      <nav className={styles.nav}>
        <NavLink className={styles.navItem} activeClassName={styles.activeNav} to="/market">
          Market
        </NavLink>
        <NavLink className={styles.navItem} activeClassName={styles.activeNav} to="/faqs">
          FAQs
        </NavLink>
      </nav>
      {account ? (
        <div className={styles.operations}>
          <NeonButton className={styles.button} onClick={() => setSelectNetworkVisible(true)}>
            <Icon className={styles.icon} iconUrl={getNetworkIcon(providerChainId!)} size={18} />
            {getNetworkName(providerChainId!)}
          </NeonButton>
          <NeonButton className={styles.button} title={account}>
            <Icon className={styles.icon} type="wallet" size={16} />
            {formatAddres(account)}
          </NeonButton>
          <Link className={styles.button} to="/profile">
            <Icon type="lisa" size={36} />
          </Link>
        </div>
      ) : (
        <div className={styles.operations}>
          <NeonButton className={styles.button} onClick={connectWeb3}>
            Connect Wallet
          </NeonButton>
        </div>
      )}
      <SelectNetwork open={selectNetworkVisible} onClose={() => setSelectNetworkVisible(false)} />
    </div>
  );
};
