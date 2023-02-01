import { useEffect } from 'react';

import Stack from '@mui/material/Stack';

import NovationProgressBar from 'components/Base/NovationProgress';
import MapItemDetail from './MapItem/MapItemDetail';
import MapItemHeader from './MapItem/MapItemHeader';
import MapItemViewPool from './MapItem/MapItemViewPool';
import MapItemWrapper from './MapItem/MapItemWrapper';
import MapItemStatus from './MapItem/MapItemStatus';
import MapItemUrls from './MapItem/MapItemUrls';

import usePool from 'hooks/usePool';
import { usePoolContract } from 'hooks/useContract';

import { ethersToBigNumber, formatNumber, fromWei, toBigNumber } from 'utils/bigNumber';

const ListMapItem: React.FC<any> = ({ pool }: any) => {
    const { poolMap, getPoolStatus } = usePool();
    const poolData = poolMap[pool] ?? {};

    const poolContract = usePoolContract(pool);

    useEffect(() => {
        if (poolContract) return;
    }, [poolContract]);

    return (
        <MapItemWrapper>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <MapItemHeader logo={poolData?.urls?.logo} title={poolData.name} />
                <MapItemStatus status={getPoolStatus(poolData)} />
            </Stack>
            <MapItemUrls urls={poolData.urls} />
            <Stack spacing={2.5} py={1}>
                <MapItemDetail title="Sale Type" value={poolData.publicMode ? 'Public' : 'Private'} />
                <MapItemDetail
                    title="SC"
                    value={poolData.softcap ? `${formatNumber(fromWei(poolData.softcap))} BNB` : null}
                />
                <MapItemDetail
                    title="HC"
                    value={poolData.hardcap ? `${formatNumber(fromWei(poolData.hardcap))} BNB` : null}
                />
                <MapItemDetail
                    title="Rate"
                    value={
                        poolData.salePrice && poolData.decimals && poolData.symbol
                            ? `1 BNB = ${formatNumber(fromWei(poolData.salePrice, poolData.decimals))} ${
                                  poolData.symbol
                              }`
                            : null
                    }
                />
                <MapItemDetail
                    title="Liquidity"
                    value={poolData.liquidityAlloc ? `${formatNumber(poolData.liquidityAlloc / 100)}%` : null}
                />
            </Stack>
            <NovationProgressBar
                label="Progress"
                value={
                    poolData.raised && poolData.hardcap
                        ? Number(
                              ethersToBigNumber(poolData.raised)
                                  .dividedBy(ethersToBigNumber(poolData.hardcap))
                                  .times(toBigNumber(100))
                          )
                        : 0
                }
                min={poolData.raised ? `${formatNumber(fromWei(poolData.raised))} BNB` : null}
                max={poolData.hardcap ? `${formatNumber(fromWei(poolData.hardcap))} BNB` : null}
            />
            <MapItemViewPool pool={pool} />
        </MapItemWrapper>
    );
};

export default ListMapItem;
