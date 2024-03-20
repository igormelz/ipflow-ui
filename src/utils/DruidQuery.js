import {AGGREGATIONS} from "./api";

export default class DruidQuery {
  constructor(build) {
    this.queryType = build.queryType;
    this.dataSource = build.datasource;
    this.granularity = "all";
    this.dimensions = build.dimensions;
    this.dimension = build.dimension;
    this.metric = build.metric;
    this.threshold = build.threshold;
    this.limit = build.limit;
    this.filter = build.filters;
    this.aggregations = build.aggregations;
    this.postAggregations = build.postAggregations;
    this.intervals = build.intervals;
    this.having = build.having;
    this.searchDimensions = build.searchDimensions;
    this.query = build.query;
    //this.context = build.context;
    this.context = build.context !== undefined ? build.context : {timeout: 3000 };
  }

  static get Builder() {
    class Builder {
      constructor(datasource) {
        this.datasource = datasource;
      }
      withQueryType(queryType) {
        this.queryType = queryType;
        return this;
      }
      withGranularity(granularity) {
        this.granularity = granularity;
        return this;
      }
      withDimensions(dimensions) {
        this.dimensions = dimensions;
        return this;
      }
      withFilter(filters) {
        if (filters.length > 1) {
          this.filters = {
            type: "and",
            fields: filters.flatMap(this.fmtFilter)
          };
        } else if (filters.length === 1) {
          this.filters = this.fmtFilter(filters[0]);
        }
        return this;
      }
      withAggregations(aggregations) {
        //this.aggregations = aggregations;
        this.aggregations = Array.isArray(aggregations) ? aggregations : [AGGREGATIONS.find(a => a.name === aggregations)];
        return this;
      }
      withPostAggregations(postAggregations) {
        this.postAggregations = postAggregations;
        return this;
      }
      withIntervals(intervals) {
        this.intervals = [intervals];
        return this;
      }
      withHaving(having) {
        this.having = having;
        return this;
      }
      withMetric(metric) {
        this.metric = metric;
        return this;
      }
      withDimension(dimension) {
        this.dimension = dimension;
        return this;
      }
      withThreshold(threshold) {
        this.threshold = threshold;
        return this;
      }
      withLimit(limit) {
        this.limit = limit;
        return this;
      }
      withSearchDimensions(searchDimensions) {
        this.searchDimensions = searchDimensions;
        return this;
      }
      withQuery(query) {
        this.query = {
          type: "insensitive_contains",
          value: query
        };
        return this;
      }
      withContext(context) {
        this.context = context;
        return this;
      }
      build() {
        return JSON.stringify(new DruidQuery(this));
      }
      // fmt filters
      fmtFilter = f =>
        f.type === "not"
          ? {
              type: "not",
              field: {
                type: "selector",
                dimension: f.dimension,
                value: f.value
              }
            }
          : f;
    }
    return Builder;
  }
}
