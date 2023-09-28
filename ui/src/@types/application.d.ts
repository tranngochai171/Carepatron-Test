type ClientType = {
	id?: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
};

type ApplicationStateType = {
	clients: ClientType[];
};

type ColumnDashboard = {
	id: string;
	label: React.ReactNode;
	headerStyle?: React.CSSProperties;
	cellStyle?: React.CSSProperties;
};
