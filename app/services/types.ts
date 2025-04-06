export interface EloRecord {
	elo_record_id: number;
	fight_number: number;
	elo_rating: string;
	event_name?: string;
	event_date?: string;
}

export interface FighterProgression {
	fighter_id: number;
	fighter_name: string;
	total_fights: number;
	elo_progression: EloRecord[];
}

export interface FighterDropdown {
	id: number;
	name: string;
}

export interface FighterRecord {
	fighter_id: number;
	fighter_name: string;
	elo_rating: string;
}

export interface PaginationParams {
	skip?: number;
	limit?: number;
	sort?: string;
	order?: 'asc' | 'desc';
}

export interface FighterEloProgressionResponse {
	fighter_id: number;
	fighter_name: string;
	total_fights: number;
	elo_progression: EloRecord[];
}

export interface FighterPaginationMeta {
	total_count: number;
	page: number;
	per_page: number;
	pages: number;
}

export interface FighterEloPaginationResponse {
	data: FighterEloProgressionResponse[];
	total_count: number;
	pagination: FighterPaginationMeta;
}
