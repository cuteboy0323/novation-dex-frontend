import { useContext } from 'react';

import { APIContext } from 'contexts/api';

// ==============================|| CONFIG - HOOKS  ||============================== //

const useApi = () => useContext(APIContext);

export default useApi;
