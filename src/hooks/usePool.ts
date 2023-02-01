import { useContext } from 'react';

import { PoolContext } from 'contexts/pool';

// ==============================|| CONFIG - HOOKS  ||============================== //

const usePool = () => useContext(PoolContext);

export default usePool;
