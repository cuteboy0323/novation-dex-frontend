// ** React Methods ** //
import { useState, useMemo, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

// ** Custom Eelemtns ** //
import ListTabs from 'components/Launchpad/List/ListTabs';
import ListWrapper from 'components/Launchpad/List/ListWrapper';
import ListHeader from 'components/Launchpad/List/ListHeader';
import ListMapWrapper from 'components/Launchpad/List/ListMapWrapper';
import ListMapItem from 'components/Launchpad/List/ListMapItem';

import usePool from 'hooks/usePool';

const perPage = 6;

const List = () => {
    const [page, setPage] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('all');

    const { poolMap, getPoolStatus, updatePoolMap, updatePoolToken, getPoolMap, updatePool } = usePool();

    const handleActiveTabChange = (event: React.SyntheticEvent, newTab: string) => {
        setPage(1);
        setActiveTab(newTab);
    };
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const filteredPools = useMemo(() => {
        const entries = Object.entries(poolMap);
        const sorted = entries.sort(([pool1, map1]: any, [pool2, map2]: any) => {
            return Number(map2.createdAt) - Number(map1.createdAt);
        });
        switch (activeTab) {
            case 'all': {
                const all = sorted;
                return Object.fromEntries(all);
            }
            case 'live': {
                const live = sorted.filter(([pool, map]: [string, any]) => {
                    return getPoolStatus(map) === 'live';
                });
                return Object.fromEntries(live);
            }
            case 'upcoming': {
                const upcoming = sorted.filter(([pool, map]: [string, any]) => {
                    return getPoolStatus(map) === 'upcoming';
                });
                return Object.fromEntries(upcoming);
            }
            case 'ended': {
                const ended = sorted.filter(([pool, map]: [string, any]) => {
                    return getPoolStatus(map) === 'ended';
                });
                return Object.fromEntries(ended);
            }
        }
    }, [activeTab, poolMap]);

    const [pageData, pageCount] = useMemo(() => {
        const entries = Object.entries(filteredPools);
        const unrevoked = entries.filter((item: any, index: number) => item[1]?.revoked !== true);
        const count = Math.ceil(unrevoked.length / perPage);
        const pd = unrevoked.filter(
            (item: any, index: number) => index >= perPage * (page - 1) && index < perPage * page
        );
        const object = Object.fromEntries(pd);
        return [object, count];
    }, [filteredPools, perPage, page]);

    const poolList = useMemo(() => {
        return Object.keys(pageData);
    }, [pageData]);

    const updatePageData = useCallback(() => {
        poolList.forEach(async (element: string) => {
            updatePool(element);
            updatePoolMap(element);
            const { token } = await getPoolMap(element);
            if (token) updatePoolToken(element, token);
        });
    }, [activeTab, perPage, poolList.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            updatePageData();
        }, 12000);
        updatePageData();
        return () => clearInterval(interval);
    }, [updatePageData]);

    return (
        <ListWrapper>
            <ListHeader />
            <ListTabs value={activeTab} onChange={handleActiveTabChange} />
            <Stack direction="row" pt={3} justifyContent={{ xs: 'center', sm: 'flex-end' }}>
                <Pagination
                    count={pageCount}
                    page={page}
                    variant="outlined"
                    shape="rounded"
                    onChange={handlePageChange}
                />
            </Stack>
            <ListMapWrapper>
                {poolList.map((element: string) => (
                    <ListMapItem key={element} pool={element} />
                ))}
            </ListMapWrapper>
            <Stack direction="row" pt={3} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                <Pagination
                    count={pageCount}
                    page={page}
                    variant="outlined"
                    shape="rounded"
                    onChange={handlePageChange}
                />
            </Stack>
        </ListWrapper>
    );
};

export default List;
