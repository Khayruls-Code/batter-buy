class ProductFeatures {
  constructor(query, queryString) {
    this.query = query,
      this.queryString = queryString
  }
  //search product
  search() {
    const keyword = this.queryString.keyword ? {
      name: {
        $regex: this.queryString.keyword,
        $options: 'i'
      }
    } : {}
    this.query = this.query.find({ ...keyword })
    return this;
  }

  //filter product
  filter() {
    const copyQuery = { ...this.queryString }

    //remove some query
    const queryArr = ["keyword", "page", "limit"]
    queryArr.forEach(key => delete copyQuery[key])

    //filter by price and rating
    let queryJSON = JSON.stringify(copyQuery)
    queryJSON = queryJSON.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

    this.query = this.query.find(JSON.parse(queryJSON))
    return this;
  }

  //pagination
  pagination(pagePerView) {
    const pageNumber = this.queryString.page
    const skipCount = pagePerView * (pageNumber - 1)
    this.query = this.query.limit(pagePerView).skip(skipCount)
    return this;
  }

}

module.exports = ProductFeatures;