import { FC } from 'react';
import styles from './index.module.less';

export interface TokenType {
  symbol: string;
  address: string;
  logoURI: string;
  decimals: number;
}

interface TokenListProps {
  tokens: TokenType[];
}

export const TokenList: FC<TokenListProps> = ({ tokens }) => {
  return (
    <div>
      <ul>
        {tokens.map((token) => {
          <li key={token.address}>
            <Token token={token} />
          </li>;
        })}
      </ul>
    </div>
  );
};

interface TokenProps {
  token: TokenType;
}
const Token: FC<TokenProps> = ({ token }) => {
  return (
    <div className={styles.token}>
      <img className="icon" src={token.logoURI} alt={token.symbol} />
    </div>
  );
};
