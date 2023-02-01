// ** Material UI Components ** //
import Box from '@mui/material/Box';

const SearchIcon = () => {
    return (
        <Box
            component="img"
            src={require('assets/img/icons/search-normal.svg').default}
            alt="Search Icon"
            width={24}
            height={24}
        />
    );
};

export default SearchIcon;
