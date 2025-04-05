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
