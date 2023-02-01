import { useState, useEffect, useMemo } from 'react';

// ** Material UI Components ** //
import Stack from '@mui/material/Stack';
import NovationInput from 'components/Base/NovationInput';
import NovationButton from 'components/Base/NovationButton';

// ** Extra Components ** //
import { ToastDescriptionWithTx } from 'components/Toast';

// ** Hooks ** //
import useToast from 'hooks/useToast';
import useCatchTxError from 'hooks/useCatchTxError';
import { useDiscributorContract, useSwapContract } from 'hooks/useContract';

// ** Utils ** //
import { isAddress } from 'utils';

const Admin = () => {
    const [values, setValues] = useState<any>({});
    const [token, setToken] = useState<string>();
    const [tokenOwner, setTokenOwner] = useState<string>();

    const { toastSuccess } = useToast();
    const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();

    const swapContract = useSwapContract();
    const disctributorContract = useDiscributorContract(isAddress(values.fee) ? values.fee : null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value
        }));
    };

    const update = async () => {
        const receipt = await fetchWithCatchTxError(() => {
            return swapContract.setFeeDistributor(values.token, values.fee, values.owner);
        });
        if (receipt?.status) {
            toastSuccess(
                'Updated',
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    It has been updated successfully.
                </ToastDescriptionWithTx>
            );
        }
    };

    useEffect(() => {
        if (!disctributorContract) {
            setTokenOwner('');
            setToken('');
            return;
        }
        disctributorContract
            .token()
            .then(setToken)
            .catch(() => setToken(''));
        disctributorContract
            .tokenOwner()
            .then(setTokenOwner)
            .catch(() => setTokenOwner(''));
    }, [disctributorContract]);

    const isOwner = useMemo(() => {
        if (!token || !tokenOwner || !isAddress(values.owner) || !isAddress(values.token)) return;
        return (
            tokenOwner?.toLowerCase() === values.owner?.toLowerCase() &&
            token?.toLowerCase() === values.token?.toLowerCase()
        );
    }, [token, tokenOwner, values.token, values.owner]);

    return (
        <Stack spacing={2} pt={1}>
            <Stack spacing={3} py={5}>
                <NovationInput
                    id="token"
                    value={values.token ?? ''}
                    onChange={handleInputChange}
                    label="Token"
                    placeholder="0x ..."
                />
                <NovationInput
                    id="fee"
                    value={values.fee ?? ''}
                    onChange={handleInputChange}
                    label="Fee Distributor"
                    placeholder="0x ..."
                />
                <NovationInput
                    id="owner"
                    value={values.owner ?? ''}
                    onChange={handleInputChange}
                    label="Owner"
                    placeholder="0x ..."
                />
            </Stack>
            <NovationButton
                loading={pendingTx}
                onClick={update}
                disabled={(() => {
                    if (isOwner && isAddress(values.token)) return false;
                    return true;
                })()}
            >
                Update
            </NovationButton>
        </Stack>
    );
};

export default Admin;
