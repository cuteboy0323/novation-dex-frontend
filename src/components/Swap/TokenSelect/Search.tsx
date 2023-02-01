// ** Material UI Components ** //
import TextField from '@mui/material/TextField';

const Search = ({ search, setSearch }: any) => {
    return (
        <TextField
            fullWidth
            variant="filled"
            value={search ?? ''}
            onChange={(e: any) => setSearch(e.target.value)}
            inputProps={{
                placeholder: 'Search token name or paste address'
            }}
            sx={{
                '& input': {
                    color: 'primary.main',
                    fontSize: 14,
                    py: 2,
                    px: 2.5
                }
            }}
        />
    );
};

export default Search;
