import React from 'react';

// ** Material UI Components ** //
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

import { NETWORK_LIST } from 'config';

const NetworkListItem = (props: any) => {
    const { network, onNetworkSelect, activeNetwork } = props;

    return (
        <ListItem
            sx={{
                width: 'calc((100% - 32px) / 3)'
            }}
            disablePadding
        >
            <ListItemButton
                sx={{
                    borderRadius: 1,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    borderColor: network.id === activeNetwork.id ? 'rgb(255 255 255 / 30%)' : 'divider',
                    background: network.id === activeNetwork.id ? 'rgba(255, 255, 255, 0.08)' : 'none'
                }}
                onClick={() => {
                    if (network.id === activeNetwork.id) return;
                    onNetworkSelect(network);
                }}
            >
                <ListItemAvatar sx={{ minWidth: 32 }}>
                    <Avatar
                        src={require(`assets/img/network/${network.icon}`)}
                        sx={{
                            width: 32,
                            height: 32
                        }}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={network.name}
                    primaryTypographyProps={{
                        sx: {
                            minWidth: 70,
                            textAlign: 'center'
                        }
                    }}
                    sx={{
                        margin: 0
                    }}
                />
            </ListItemButton>
        </ListItem>
    );
};

const NetworkList = (props: any) => {
    return (
        <Stack
            sx={{
                maxHeight: { xs: 480, sm: 400 },
                height: { xs: 480, sm: 'unset' },
                overflow: 'auto'
            }}
        >
            <List
                sx={{
                    pt: 0,
                    flexDirection: 'row',
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap'
                }}
            >
                {NETWORK_LIST.map((network) => (
                    <NetworkListItem key={network.id} network={network} {...props} />
                ))}
            </List>
        </Stack>
    );
};

export default NetworkList;
