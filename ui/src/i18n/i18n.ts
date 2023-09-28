import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import COMMON_EN from '@/locales/en/common.json';
import CLIENT_EN from '@/locales/en/clients.json';
import CREATE_CLIENT_MODAL_EN from '@/locales/en/createClientModal.json';
import TOAST_EN from '@/locales/en/toast.json';
import COMMON_VI from '@/locales/vi/common.json';
import CLIENT_VI from '@/locales/vi/clients.json';
import CREATE_CLIENT_MODAL_VI from '@/locales/vi/createClientModal.json';
import TOAST_VI from '@/locales/vi/toast.json';
import englandFlag from '@/assets/images/united-kingdom.png';
import vietnamFlag from '@/assets/images/vietnam.png';

export const LOCAL_STORAGE_LANGUAGE_KEY = 'lng';

export const LANGUAGES = {
	EN: 'en',
	VI: 'vi',
} as const;

export const MAPPING_FLAG = {
	[LANGUAGES.EN]: {
		src: englandFlag,
		alt: 'England flag',
	},
	[LANGUAGES.VI]: {
		src: vietnamFlag,
		alt: 'Vietnam flag',
	},
} as const;

export const NAME_SPACES = {
	CLIENTS: 'clients',
	CREATE_CLIENT_MODAL: 'create_client_modal',
	COMMON: 'common',
	TOAST: 'toast',
} as const;

export const locales: Record<(typeof LANGUAGES)[keyof typeof LANGUAGES], string> = {
	[LANGUAGES.EN]: 'English',
	[LANGUAGES.VI]: 'Tiếng Việt',
};

export const resources = {
	[LANGUAGES.EN]: {
		[NAME_SPACES.COMMON]: COMMON_EN,
		[NAME_SPACES.CLIENTS]: CLIENT_EN,
		[NAME_SPACES.CREATE_CLIENT_MODAL]: CREATE_CLIENT_MODAL_EN,
		[NAME_SPACES.TOAST]: TOAST_EN,
	},
	[LANGUAGES.VI]: {
		[NAME_SPACES.COMMON]: COMMON_VI,
		[NAME_SPACES.CLIENTS]: CLIENT_VI,
		[NAME_SPACES.CREATE_CLIENT_MODAL]: CREATE_CLIENT_MODAL_VI,
		[NAME_SPACES.TOAST]: TOAST_VI,
	},
} as const;

export const defaultNS = NAME_SPACES.CLIENTS;

i18n.use(initReactI18next).init({
	resources,
	lng: localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) || LANGUAGES.EN,
	fallbackLng: LANGUAGES.EN,
	ns: [NAME_SPACES.COMMON, NAME_SPACES.CLIENTS, NAME_SPACES.CREATE_CLIENT_MODAL],
	defaultNS,
	interpolation: {
		escapeValue: false, // react already safes from xss
	},
});
