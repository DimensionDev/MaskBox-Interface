import { FC, HTMLProps } from 'react';

interface LinkProps extends HTMLProps<HTMLAnchorElement> {}
const Link: FC<LinkProps> = ({ href, children }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children ?? href}
    </a>
  );
};
export const faqs = [
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
      'Our current test network is Ropsten. Please switch the wallet to Ropsten network for testing.',
  },
];
