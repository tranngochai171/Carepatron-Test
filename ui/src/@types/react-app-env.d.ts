declare namespace NodeJS {
	interface ProcessEnv {
		//types of envs
		NODE_ENV: 'development' | 'production' | 'test';
		REACT_APP_API_URL: string;
	}
}
