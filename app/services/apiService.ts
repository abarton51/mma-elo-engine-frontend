import axios from 'axios';
import { PaginationParams } from './types';

const apiUrl: string = process.env.NEXT_PUBLIC_API_URL || 'https://mma-elo-engine-backend.onrender.com';

if (!apiUrl) {
	console.warn('NEXT_PUBLIC_API_URL is not set! Falling back to localhost.');
}

const api = axios.create({
	baseURL: apiUrl || 'http://localhost:5050',
});

// Get all fighters
export const getFighters = async ({
	skip,
	limit,
	sort,
	order
}: PaginationParams): Promise<any> => {
	try {
		const response = await api.get('api/fighters', {
			params: { skip, limit, sort, order }
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching fighters:', error);
		throw error;
	}
};

// Function to fetch current Elo record by fighter name
export const getFightersByName = async (
	fighterName: string,
	params: PaginationParams = {}
): Promise<any> => {
	try {
		const response = await api.get('api/fighters/search', {
			params: {
				fighter_name: fighterName,
				...params
			}
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching fighter records:', error);
		throw error;
	}
};

// Get all fights
export const getFights = async (): Promise<any> => {
	const response = await api.get('api/fights');
	return response.data;
};

// Get all events
export const getEvents = async (params: PaginationParams = {}): Promise<any> => {
	try {
		const response = await api.get('api/events/', {
			params
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching events:', error);
		throw error;
	}
};

// Fetch Elo progression by fighter
export const getEloProgressionByFighter = async (
	fighterName: string,
	sort: 'asc' | 'desc' = 'asc'
): Promise<any> => {
	try {
		const response = await api.get('api/elo-records/search', {
			params: { fighter_name: fighterName, sort }
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching Elo records:', error);
		throw error;
	}
};

