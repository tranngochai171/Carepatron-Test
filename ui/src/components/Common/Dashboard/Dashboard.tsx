import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import i18next from 'i18next';
import React from 'react';

type DashboardProps<T> = {
	data: T[];
	columns: ColumnDashboard[];
	renderValue: (id: keyof T, row: T) => React.ReactNode;
	noDataText?: string;
};

const Dashboard = <T,>({
	data,
	columns,
	renderValue,
	noDataText = i18next.t('common:no_data_available'),
}: DashboardProps<T>) => {
	return (
		<Paper sx={{ width: '100%', overflow: 'hidden', margin: '2rem 0 0' }}>
			<TableContainer>
				<Table stickyHeader aria-label='sticky table'>
					<TableHead>
						<TableRow>
							{columns.map((column, index: number) => (
								<TableCell
									key={index}
									style={{
										fontSize: '14px',
										fontWeight: 600,
										...column.headerStyle,
									}}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length === 0 ? (
							<TableRow role='checkbox' tabIndex={-1}>
								<TableCell colSpan={columns.length ?? 1} sx={{ textAlign: 'center' }}>
									{noDataText}
								</TableCell>
							</TableRow>
						) : null}
						{data?.length > 0
							? data?.map((row: any, indexRow: number) => {
									return (
										<TableRow hover role='checkbox' tabIndex={-1} key={indexRow}>
											{columns.map((column, indexColumn: number) => {
												return (
													<TableCell
														key={indexColumn}
														sx={{
															whiteSpace: 'nowrap',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															...column.cellStyle,
														}}
													>
														{renderValue(column.id as keyof T, row)}
													</TableCell>
												);
											})}
										</TableRow>
									);
							  })
							: null}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default Dashboard;
