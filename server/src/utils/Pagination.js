class Pagination {
    constructor(query, page = 1, limit = 9) {
        this.query = query;
        this.page = parseInt(page, 10);
        this.limit = parseInt(limit, 10);
        this.skip = (this.page - 1) * this.limit;
    }

    async paginate() {
        try {
            // Áp dụng skip và limit trực tiếp trên query
            const results = await this.query
                .skip(this.skip)
                .limit(this.limit);

            // Đếm tổng số tài liệu phù hợp với query
            const totalDocuments = await this.query.model.countDocuments(this.query._conditions);

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
