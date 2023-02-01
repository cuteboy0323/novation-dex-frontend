// ** Material UI Components ** //
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Container, { ContainerProps } from '@mui/material/Container';

// ** Custom Components ** //
import ExtraButons from './ExtraButtons';

const Wrapper: React.FC<ContainerProps> = ({ children, ...rest }) => (
    <Container
        {...rest}
        sx={{
            maxWidth: '500px !important',
            width: { xs: 'unset', sm: '100%' },
            marginLeft: { xs: -6, sm: 'auto' },
            marginRight: { xs: -6, sm: 'auto' }
        }}
    >
        <ExtraButons />
        <Card
            variant="outlined"
            sx={{
                position: 'relative',
                borderRadius: 2,
                boxShadow: {
                    xs: 'none',
                    sm: 'inset 0px 0px 7.32115px rgb(168 252 255 / 50%), inset 0px -20px 20px -49.2654px rgb(0 172 253 / 15%), inset 0px 20px 50px -36.9491px rgb(0 172 253 / 25%)'
                },
                backgroundColor: { xs: 'transparent', sm: 'rgba(0, 172, 253, 0.05)' },
                backdropFilter: { xs: 'none', sm: 'blur(5px)' },
                borderWidth: { xs: 0, sm: 2 }
            }}
        >
            <Box
                component="img"
                src={require('assets/img/items/line01.png')}
                alt="line01"
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    width: 'calc(100% - 32px)',
                    position: 'absolute',
                    top: -16,
                    right: 16,
                    left: 16
                }}
            />
            <CardContent
                component={Stack}
                spacing={0.5}
                sx={{
                    padding: { xs: '48px 40px 36px 40px !important', sm: '36px !important' }
                }}
            >
                {children}
            </CardContent>
        </Card>
    </Container>
);

export default Wrapper;
