import { useEffect, useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';

import NovationDialogTitle from 'components/Base/NovationDialogTitle';

// ** Hooks ** //
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Types ** //
import { Alert, AlertTitle, ThemeOptions } from '@mui/material';
import { getBscScanLink, isAddress } from 'utils';

const PaperProps = {
    sx: {
        bgcolor: '#020B0F',
        backgroundImage: 'none',
        border: '2px solid #00ACFD',
        borderRadius: 2,
        margin: { xs: 0, sm: 4 },
        width: {
            xs: 'calc(100% - 48px)',
            sm: 'calc(100% - 64px)'
        }
    }
};

const FileUpload = ({ open, onClose: closeModal, onEvent }: any) => {
    const isMobile = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

    const [file, setFile] = useState<any>();
    const [content, setContent] = useState<any>();

    const onChange = async (event: any) => {
        setFile(event.target.files[0]);
    };

    const onClose = () => {
        setFile(null);
        setContent(null);
        closeModal();
    };

    useEffect(() => {
        if (!file) return;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const contents = e.target.result;
            setContent(contents);
        };
        fileReader.readAsText(file);
    }, [file]);

    const contentMap = useMemo(() => {
        if (!content) return;
        const map = content.split('\r\n');
        const list = [];
        map.forEach((element: string) => {
            if (!isAddress(element)) return;
            list.push(element);
        });
        return list;
    }, [content]);

    const FileUploadModalContent = (
        <>
            <NovationDialogTitle id="swap-token-select-dialog" onClose={onClose}>
                Whitelist Upload
            </NovationDialogTitle>
            {file ? (
                <Box>
                    <List
                        sx={{
                            px: { xs: 3, sm: 4 }
                        }}
                    >
                        <ListItem
                            sx={{
                                bgcolor: 'rgba(0, 172, 253, 0.1)',
                                borderRadius: 1
                            }}
                        >
                            <ListItemAvatar sx={{ minWidth: 44 }}>
                                <Avatar
                                    src={require('assets/img/icons/document-upload.svg').default}
                                    sx={{ width: 32, height: 32 }}
                                />
                            </ListItemAvatar>
                            <ListItemText primary={file.name} secondary={`Detected ${contentMap?.length} addresses.`} />
                            <Button variant="outlined" component="label">
                                <input hidden type="file" onChange={onChange} />
                                Change
                            </Button>
                        </ListItem>
                    </List>
                    {contentMap?.length === 0 ? (
                        <Box
                            sx={{
                                px: { xs: 3, sm: 4 }
                            }}
                        >
                            <Alert severity="error">
                                <AlertTitle>Invalid File.</AlertTitle>
                                Please upload correct file that has address's list for whiltelist.
                            </Alert>
                        </Box>
                    ) : null}
                    <Stack
                        spacing={0.75}
                        sx={{
                            maxHeight: 450,
                            overflow: 'auto',
                            px: { xs: 3, sm: 4 },
                            mr: -5 / 8,
                            pb: 2
                        }}
                    >
                        {contentMap
                            ? contentMap.map((item: any, index: number) => {
                                  return (
                                      <Stack
                                          key={index}
                                          direction="row"
                                          alignItems="center"
                                          justifyContent="space-between"
                                          sx={{
                                              bgcolor: 'rgba(0, 172, 253, 0.1)',
                                              borderRadius: 1,
                                              py: 1,
                                              px: 3
                                          }}
                                      >
                                          <Typography fontSize={14} color="primary">
                                              {`${item.substring(0, 10)}... ${item.substring(item.length - 10)}`}
                                          </Typography>
                                          <Link href={getBscScanLink(item, 'address')} underline="none" target="_blank">
                                              <IconButton size="small">
                                                  <Avatar
                                                      src={
                                                          require('assets/img/icons/bscscan-logo-light-circle.svg')
                                                              .default
                                                      }
                                                      sx={{ width: 18, height: 18 }}
                                                  />
                                              </IconButton>
                                          </Link>
                                      </Stack>
                                  );
                              })
                            : null}
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            py: 2,
                            px: { xs: 3, sm: 4 }
                        }}
                    >
                        <Button onClick={onClose} fullWidth variant="outlined" color="error">
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            disabled={!file || !contentMap || contentMap?.length === 0}
                            onClick={() => {
                                onEvent(file, contentMap);
                            }}
                        >
                            Upload
                        </Button>
                    </Stack>
                </Box>
            ) : (
                <DialogContent
                    dividers
                    sx={{
                        minHeight: 85,
                        px: { xs: 3, sm: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        borderBottom: 'none'
                    }}
                >
                    <Stack
                        component="label"
                        alignItems="center"
                        spacing={2}
                        sx={{
                            cursor: 'pointer',
                            opacity: 0.75,
                            transition: '.25s',
                            bgcolor: 'rgba(0, 172, 253, 0.1)',
                            borderRadius: 2,
                            py: 2,
                            '&:hover': {
                                opacity: 1
                            }
                        }}
                    >
                        <Stack>
                            <input hidden type="file" onChange={onChange} />
                            <Box
                                component="img"
                                src={require('assets/img/icons/document-upload.svg').default}
                                sx={{
                                    width: 24,
                                    top: 'calc(50% - 12px) !important',
                                    right: '12px !important'
                                }}
                            />
                        </Stack>
                        <Typography color="primary" fontSize={14}>
                            Upload File with the Wallet Addresses
                        </Typography>
                    </Stack>
                </DialogContent>
            )}
        </>
    );

    if (isMobile) {
        return (
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                onOpen={() => {}}
                PaperProps={{
                    sx: {
                        bgcolor: '#020B0F',
                        backgroundImage: 'none',
                        borderTop: '2px solid #00ACFD',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        overflowX: 'hidden'
                    }
                }}
            >
                {FileUploadModalContent}
            </SwipeableDrawer>
        );
    }
    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            onClose={onClose}
            aria-labelledby="swap-token-select-dialog"
            open={open}
            sx={{
                paddingLeft: { xs: 0, sm: 'calc((78px + 36px + 42px) / 2)' }
            }}
            PaperProps={PaperProps}
        >
            {FileUploadModalContent}
        </Dialog>
    );
};

export default FileUpload;
