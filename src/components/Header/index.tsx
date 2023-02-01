// ** Custom Components ** //
import Logo from './Logo';
import Wrapper from './Wrapper';
import WalletButton from './WalletButton';
import SpaceBox from 'components/Items/SpaceBox';

const Header = () => {
    return (
        <Wrapper>
            <Logo />
            <SpaceBox />
            <WalletButton />
        </Wrapper>
    );
};

export default Header;
