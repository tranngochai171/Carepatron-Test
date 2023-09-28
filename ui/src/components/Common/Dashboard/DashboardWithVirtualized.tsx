import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import Dashboard from './Dashboard';

type SxHeight = number | string | { [key in 'xs' | 'sm' | 'md' | 'lg' | 'xl']?: string | number };

type DashboardProps<T> = {
	data: T[];
	columns: ColumnDashboard[];
	renderValue: (id: keyof T, row: T) => React.ReactNode;
	noDataText?: string;
	height?: SxHeight;
};

const DashboardWithVirtualized = <T,>(props: DashboardProps<T>) => {
	const { data, columns, renderValue, height = 400 } = props;
	const fixedHeaderContent = useCallback(() => {
		return (
			<TableRow>
				{columns.map((column, index: number) => (
					<TableCell
						key={index}
						variant='head'
						style={{ fontSize: '14px', fontWeight: 600, ...column.headerStyle }}
						sx={{
							backgroundColor: 'background.paper',
						}}
					>
						{column.label}
					</TableCell>
				))}
			</TableRow>
		);
	}, [columns]);

	const rowContent = useCallback(
		(_index: number, row: T) => {
			return (
				<React.Fragment>
					{columns.map((column, indexColumn: number) => (
						<TableCell
							key={indexColumn}
							sx={{
								'& p': {
									textOverflow: 'ellipsis',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
								},
								'& p:hover': {
									textOverflow: 'clip',
									whiteSpace: 'normal',
									wordBreak: 'break-all',
								},
								...column.cellStyle,
							}}
						>
							{renderValue(column.id as keyof T, row)}
						</TableCell>
					))}
				</React.Fragment>
			);
		},
		[columns, renderValue]
	);

	const VirtuosoTableComponents: TableComponents<T> = useMemo(
		() => ({
			Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
				<TableContainer component={Paper} {...props} ref={ref} />
			)),
			Table: (props) => (
				// @ts-ignore
				<Table
					{...props}
					sx={{
						borderCollapse: 'separate',
						tableLayout: 'fixed',
					}}
				/>
			),
			// @ts-ignore
			TableHead,
			// @ts-ignore
			TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
			TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
		}),
		[]
	);

	return data.length === 0 ? (
		<Dashboard {...props} />
	) : (
		<Paper sx={{ width: '100%', height }}>
			<TableVirtuoso
				data={data}
				components={VirtuosoTableComponents}
				fixedHeaderContent={fixedHeaderContent}
				itemContent={rowContent}
			/>
		</Paper>
	);
};

export default DashboardWithVirtualized;
