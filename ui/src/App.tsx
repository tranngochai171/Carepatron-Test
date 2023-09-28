import './App.css';
import Providers from './components/Providers/Providers';
import { Routes, Route } from 'react-router-dom';
import Clients from '@/pages/Clients';

export default function App() {
	return (
		<div className='App'>
			<Providers>
				<Routes>
					<Route path='/' element={<Clients />} />
					<Route path='/Clients' element={<Clients />} />
				</Routes>
			</Providers>
		</div>
	);
}
