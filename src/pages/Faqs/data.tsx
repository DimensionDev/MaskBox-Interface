import { FC, HTMLProps } from 'react';

interface LinkProps extends HTMLProps<HTMLAnchorElement> {}
const Link: FC<LinkProps> = ({ href, children }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children ?? href}
    </a>
  );
};
export const faqsInEn = [
  {
    title: 'How to login to MASKBOX?',
    answer: 'Use MetaMask wallet or a wallet that supports WalletConnect to login.',
  },
  {
    title: 'How to install MetaMask?',
    answer: (
      <p>
        Please download the MetaMask that suits your device on <Link href="https://metamask.io" />.
      </p>
    ),
  },
  {
    title: 'What is an NFT (Non-Fungible Token)?',
    answer:
      'An NFT (Non-Fungible Token) is inseparable, irreplacable and unique. Simply put, it corresponds with items such as game props, digital artwork and tickets in the real society, and it enables higher display and transaction attributes for products in real society.',
  },
  {
    title: 'How to purchase an NFT (Non-Fungible Token)?',
    answer:
      'After connecting your digital wallet, you can purchase it with event-limited digital coins. ',
  },
  {
    title: 'What is the purchase mechanism of Mystery?',
    answer:
      "Mystery uses chainlink random numbers as the source of random draws. This enables each user to make a fair purchase. After the purchase is successful, the NFT will be sent to the user's payment wallet.",
  },
  {
    title: 'Why does it cost ETH for purchase?',
    answer:
      'Mainnet tokens are needed to pay gas fees in different network purchases. Both the success and failure of the purchase will result in gas fees.',
  },
  {
    title: 'How to check a purchased NFT?',
    answer: 'You can click My item in the header menu to view the NFT you purchased in MASKBOX.',
  },
  {
    title: 'How to sell your purchased NFT? ',
    answer: (
      <p>
        Currently, MASKBOX does not provide the function of selling NFTs. You can jump to{' '}
        <Link href="https://opensea.io" /> to sell your NFT.,
      </p>
    ),
  },
  {
    title: 'What is the MASKBOX platform?',
    answer:
      'MASKBOX is an organization that professionally distributes NFTs. It is created by a well-known team in the industry. It has strong commercial partnerships with many digital art publishers. It provides the technology and initial distribution for digital art NFTs.',
  },
  {
    title: 'How to contact us to issue an NFT?',
    answer: (
      <p>
        Currently only applicable to partners. If you have business intentions, please fill out the{' '}
        <Link href="#">cooperation form</Link>. We will get in touch with you in time.
      </p>
    ),
  },
  {
    title: 'Is our contract safe? ?',
    answer: (
      <p>
        Our contract is written by senior engineers with many years of expereince. We have
        industry-leading solutions for gas cost optimization. There are also first-class contract
        security engineers to conduct multiple rounds of contract inspections. Please check our{' '}
        <Link href="https://github.com">Github</Link> for the source code of the contract.
      </p>
    ),
  },
  {
    title: 'What is our test network?',
    answer:
      'Our current test network is Rinkeby. Please switch the wallet to Rinkeby network for testing.',
  },
];

export const faqsInZh = [
  {
    title: '如何登录 Maskbox？',
    answer: '使用 MetaMask 钱包或支持 Wallet Connect 的钱包进行登录。',
  },
  {
    title: '如何安装 MetaMask?',
    answer: (
      <p>
        请登录 <Link href="https://metamask.io" /> 下载适合您设备的 MateMask.
      </p>
    ),
  },
  {
    title: '什么是 NFT (非同质化代币)?',
    answer:
      'NFT 英文名称为 Non-Fungible Token,翻译为中文就是:非同质化代币,具有不可分割、不可替代、独一无二的特点.  简单来理解,使得它可以锚定现实社会的游戏道具、数字艺术品、门票等.让现实社会中的产品具有更高的展示和交易属性.',
  },
  {
    title: '如何购买 NFT(非同质化代币)?',
    answer: '连接数字钱包后.可以使用活动限定的数字货币.进行购买.',
  },
  {
    title: 'Mystery 购买机制?',
    answer:
      'Mystery 采取使用 chiailink 随机数作为随机抽奖来源.使每个用户能够公平进行购买.购买成功后会成功发送 NFT 至购买用户的付款钱包.',
  },
  {
    title: '购买为什么需要消耗 ETH?',
    answer: '在不同网络购买中会消耗主网代币,购买成功或者失败都会产生 gas 费用的消耗.',
  },
  {
    title: '如何查看已购买的 NFT?',
    answer: '可以点击头部菜单中的 My item,就可以查看您在 MASKBOX 中购买的 NFT.',
  },
  {
    title: '如何转售已购买的 NFT?',
    answer: (
      <p>
        目前 MASKBOX 尚未提供 NFT出售功能,您可以跳转至 <Link href="https://opensea.io" /> 出售您的
        NFT.
      </p>
    ),
  },
  {
    title: '什么是 MASKBOX 平台?',
    answer:
      'MASKBOX 是进行专业发行 NFT 的机构,由行业知名团队创建.和多家数字艺术出版商有较强的商业合作关系.为其提供数字艺术品 NFT 化提供技术和初始发行工作.',
  },
  {
    title: '如何联系我们发行 NFT?',
    answer: (
      <p>
        目前仅适用于合作方进行发行.如有业务意向请填写<Link href="#">合作表单</Link>.
        我们会及时和您取得联系.
      </p>
    ),
  },
  {
    title: '我们的合约是否安全?',
    answer: (
      <p>
        我们的合约是经过多年资深工程师.有行业一流的 Gas
        费用优化方案.也有一流的合约安全的工程师进行多轮的合约检查.合约源码请查看我们{' '}
        <Link href="https://github.com">Github</Link>.
      </p>
    ),
  },
  {
    title: '我们的测试网络?',
    answer: '我们目前测试网络是 Rinkeby ,请钱包切换至 Rinkeby 网络上.进行测试.',
  },
];
