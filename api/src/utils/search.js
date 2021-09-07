class Search {
  cache = {};
  DB = {};
  nGramSize = 2;

  constructor() {
   // TODO OVERRIDE DEFAULTS  
  }

  createNGrams(s) {
    const nGramPadding = this.nGramSize - 1;
    s = `${' '.repeat(nGramPadding)}${s.toLowerCase()}${' '.repeat(nGramPadding - 1)}`;

    let ngrams = new Array((s.length - this.nGramSize) + 1);

    for (let i = 0; i < ngrams.length; i++) {
      ngrams[i] = s.slice(i, i + this.nGramSize);
    }
    return ngrams;
  }

  calculateDistance(query) {

    if (!query) { return [{ key: null, query, score: 0.0 }]; }

    if (this.cache[query]) return this.cache[query];

    const queryNGrams = this.createNGrams(query);
    const scores = [];

    Object.keys(this.db).forEach(key => {
      const { nGrams } = this.db[key];
      let querySet = new Set(queryNGrams);
      let total = nGrams.length;
      let hits = 0;

      for (let item of nGrams) {
        if (querySet.delete(item)) {
          hits++;
        }
      }

      if (hits >= query.length) {
        scores.push({
          key,
          query: {
            nGrams: queryNGrams,
            query
          },
          score: hits / total
        });
      }
    });
  
    const hyrdratedResults = scores
      .sort((a, z) => z.score - a.score)
      .map((result) => {
        result.data = this.db[result.key];
        return result;
      });

    this.cache[query] = hyrdratedResults;

    return this.cache[query];
  }

  query(queryString) {
    return this.calculateDistance(queryString)
  }

  generateUUID(str) {
    let hash = 0;
    let i = 0;
    let len = str.length;
    while ( i < len ) {
      hash  = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
    }
    return (hash + 2147483647) + 1;
  }

  buildDbObj(address) {
    const { line1, line2, city, state, zip } = address;
    const fullStr = `${line1 + ' '}${line2 ? line2 + ' ' : ''}${city + ' '}${state + ' '}${zip}`;
    const uuid = this.generateUUID(fullStr);
    const nGrams = this.createNGrams(fullStr);

    return {
      id: uuid,
      fullStr,
      address,
      nGrams
    }
  }

  import(list) {

    this.db = list.reduce((acc, item) => {
      const { id, fullStr, address, nGrams } = this.buildDbObj(item);
      acc[id] = {
        fullStr,
        address,
        nGrams
      }
      return acc;
    }
    , {});

    return this.db;
  }

  add(addressItem) {
    const { id, fullStr, address, nGrams } = this.buildDbObj(addressItem);
    
    if (this.db[id]) {
      return {
        error: 'Address already exists.'
      }
    } else {
      this.cache = {};
      this.db[id] = {
        fullStr,
        address,
        nGrams
      }
      return this.db[id];
    }

  }

  update(id, update) {
    if (this.db[id]) {
      const existing = this.db[id];
      const newAddress = this.buildDbObj(update);
      this.db[id] = {
        ...existing,
        ...newAddress
      }

      return this.db[id];
    } else {
      return { error: 'Entry does not exist'}
    }
  }

  delete(id) {
    this.cache = {};
    delete this.db[id];
    return {
      id
    }
  }

}

export default Search;