import './App.css';
import Providers from './components/Providers/Providers';
import { Routes, Route, useLocation } from 'react-router-dom';
import loadable from '@loadable/component';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const Clients = loadable(() => import('@/pages/Clients'), {
	fallback: <div>Loading...</div>,
});

const NotFound = loadable(() => import('@/pages/NotFound'), {
	fallback: <div>Loading...</div>,
});

export default function App() {
	const location = useLocation();
	return (
		<div className='App'>
			<Providers>
				<ErrorBoundary key={location.pathname}>
					<Routes>
						<Route path='/' element={<Clients />} />
						<Route path='/clients' element={<Clients />} />
						<Route path='*' element={<NotFound />} />
					</Routes>
				</ErrorBoundary>
			</Providers>
		</div>
	);
}
