export interface Movie {
	id: number,
	title: string,
	genre: string[],
	releaseYear: number,
	director: string,
	actors: string[],
	annotation?: string,
	image?: string,
	createdYear: Date,
	updatedYear: Date,
}
