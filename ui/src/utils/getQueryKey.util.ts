export const CLIENT_LIST = 'CLIENT_LIST' as const;

const getQueryKey = {
	clientListQueryKey: (): string[] => [CLIENT_LIST],
};

export default getQueryKey;
