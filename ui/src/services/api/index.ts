import apiClient from './apiClient';

export const getClients = (): Promise<ClientType[]> => {
	return apiClient.get<ClientType[]>('clients');
};

export const createClient = (client: ClientType): Promise<void> => {
	return apiClient.post<void>('clients', client);
};

export const updateClient = (client: ClientType): Promise<void> => {
	return apiClient.put<void>('clients/' + client.id, client);
};

export const deleteClient = (clientId: string): Promise<void> => {
	return apiClient.delete<void>('clients/' + clientId);
};
