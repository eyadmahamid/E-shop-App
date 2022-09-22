class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        //    1)Filtering
        const queryStringObj = {
            // eslint-disable-next-line node/no-unsupported-features/es-syntax
            ...this.queryString
        };
        const excludesFields = ['page', 'limit', 'sort', 'fields'];
        excludesFields.forEach(field => delete queryStringObj[field]);

        let queryStr = JSON.stringify(queryStringObj);

        // Apply filteration  using [gte,gt,lte,lt]     
        // we add the $ for search of the varibale 
        // http://localhost:8000/api/v1/products?&price[gte]=50  ..we retrun title.price >=50.
        // http://localhost:8000/api/v1/products?$ratingsAverage[lt]=4 we return title.ratingsAverage < 4
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            // output =>conosle.log('-price sold) return: '-price , sold';
            // -price => יחזור מהמחיר הגדול עד הנמוך ביותר
            // sold => יחזור מהנמכר קטן ביותר עד הנמכר יותר
            // remove the bseac  " , ";
            const sortBy = this.queryString.sort.split(',').join(' ');
            // console.log(req.query.sort);
            // console.log(sortBy);
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);

        }
        // return the latest data الاحدث
        else {
            this.mongooseQuery = this.mongooseQuery.sort('-createAt')
        }

        return this;
    }

    limitFields() {
        // fields limiting
        // (URL)fields= imageCover,title,price,ratingsAverage,-category
        // return Obj  = {title,imageCover,price,ratingsAverage,-category} remove category 
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;

    }

    search(modelName) {
        // search features
        // if search of iphone we loking for the title and description  
        if (this.queryString.keyword) {
            let query = {};
            if (modelName === 'Products') {
                query.$or = [{
                    title: {
                        $regex: this.queryString.keyword,
                        $options: 'i'
                    }
                }, {
                    description: {
                        $regex: this.queryString.keyword,
                        $options: 'i'
                    }
                }];
            } else {
                query = {
                    name: {
                        $regex: this.queryString.keyword,
                        $options: 'i'
                    }
                }
            };
            this.mongooseQuery = this.mongooseQuery.find(query)
        }
        return this;
    }


    paginate(countDocuments) {
        //    2)Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit; // 2 * 10 = 20;

        const pagination = {};
        pagination.currentPaginate = page;
        pagination.limit = limit;
        pagination.numberOfPaginate = Math.ceil(countDocuments / limit) // 50 / 10 =0.2 page , Math.ciel(page)=1,
        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }

        if (skip > 0) {
            pagination.previous = page - 1;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;

    }
}

module.exports = ApiFeatures;