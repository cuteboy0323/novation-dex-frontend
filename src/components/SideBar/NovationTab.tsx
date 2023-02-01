// ** Material UI Components ** //
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

// ** Hooks ** //
import useConfig from 'hooks/useConfig';
import { useNavigate } from 'react-router-dom';

const Tab = ({ active, path, value, icon, label, ...rest }: any) => {
    const navigate = useNavigate();
    const { isOpenSideBar } = useConfig();

    return (
        <Link
            href={path}
            underline="none"
            target="_blank"
            onClick={(e) => {
                if (!path.includes('http')) e.preventDefault();
            }}
        >
            <Stack
                {...rest}
                spacing={2}
                direction="row"
                alignItems="center"
                onClick={() => (path.includes('http') ? null : navigate(path))}
                justifyContent={isOpenSideBar ? 'flex-start' : 'center'}
                sx={{
                    cursor: 'pointer',
                    marginLeft: { xs: 0, sm: isOpenSideBar ? '19px !important' : 0 },
                    '&:before': {
                        content: "''",
                        display: active === value ? 'block' : 'none',
                        position: 'absolute',
                        left: { xs: 'unset', sm: 5 },
                        bottom: { xs: 5, sm: 'unset' },
                        height: { xs: 4, sm: 33 },
                        width: { xs: 33, sm: 4 },
                        background: '#00ACFD',
                        borderRadius: 2,
                        filter: 'blur(1px)',
                        boxShadow:
                            '0px 0px 18.9113px rgba(168, 252, 255, 0.7), 0px 0px 73.2115px rgba(168, 252, 255, 0.5), inset 0px 0px 7.32115px rgba(168, 252, 255, 0.5)'
                    }
                }}
            >
                <IconButton
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    sx={{ bgcolor: 'transparent !important' }}
                >
                    <Box
                        component="img"
                        src={icon}
                        alt="Home"
                        sx={{
                            width: { xs: 32, sm: 24 },
                            filter:
                                active === value
                                    ? 'drop-shadow(0px 0px 10px #7DFFFF) drop-shadow(0px 0px 25px rgba(125, 255, 255, 0.5))'
                                    : 'none'
                        }}
                    />
                </IconButton>
                {isOpenSideBar && (
                    <Typography
                        textTransform="uppercase"
                        fontSize={14}
                        fontWeight={600}
                        color="#00ACFD"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            textShadow:
                                active === value
                                    ? '0px 0px 50px rgba(0, 172, 253, 0.5), 0px 0px 10px rgba(0, 172, 253, 0.8)'
                                    : 'none'
                        }}
                    >
                        {label}
                    </Typography>
                )}
            </Stack>
        </Link>
    );
};

export default Tab;
