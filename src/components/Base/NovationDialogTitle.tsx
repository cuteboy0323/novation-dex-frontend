import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface NovationDialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const NovationDialogTitle = (props: NovationDialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle
            sx={{
                m: 0,
                py: 2,
                px: { xs: 3, sm: 4 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
            {...other}
        >
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: 'primary.main'
                    }}
                >
                    <CloseRoundedIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export default NovationDialogTitle;
