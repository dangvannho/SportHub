class Pagination {
    constructor(query, page = 1, limit = 9) {
        this.query = query;
        this.page = parseInt(page, 10);
        this.limit = parseInt(limit, 10);
        this.skip = (this.page - 1) * this.limit;
    }

    async paginate() {
        try {
            const results = await this.query
                .skip(this.skip)
                .limit(this.limit);

            const totalDocuments = await this.query.model.countDocuments(this.query.getQuery());

            return {
                page: this.page,
                limit: this.limit,
                totalPages: Math.ceil(totalDocuments / this.limit),
                totalResults: totalDocuments,
                results
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = Pagination;
