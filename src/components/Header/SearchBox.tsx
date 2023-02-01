// ** Material UI Components ** //
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

// ** Hooks ** //
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Types ** //
import { ThemeOptions } from '@mui/material';

// ** Custom Components ** //
import SearchIcon from './SearchIcon';

const SearchBox = () => {
    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    return (
        <TextField
            variant="filled"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                )
            }}
            inputProps={{
                placeholder: 'Search pool or tokens'
            }}
            sx={{
                display: isMobile ? 'none' : 'block',
                width: '40%',
                '& input': {
                    color: 'primary.main'
                }
            }}
        />
    );
};

export default SearchBox;
