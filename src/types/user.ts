export interface UserPortfolio {
	userId: string;
	schoolName: string;
	schoolLocation: string;
	graduationYear: string;
	degree: string;
	major: string;
	sports: Sports[];
	clubs: Clubs[];
}

export interface Sports {
	sportName: string;
}

export interface Clubs {
	clubName: string;
}
