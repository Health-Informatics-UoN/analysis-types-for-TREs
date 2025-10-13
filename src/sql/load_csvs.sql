INSERT OR REPLACE INTO statistics
  SELECT * FROM read_csv('statistics.csv');

INSERT OR REPLACE INTO statistic_aliases
  SELECT * FROM read_csv('statistic_aliases.csv');

INSERT OR REPLACE INTO statistic_relationships
  SELECT * FROM read_csv('statistic_relationships.csv');

INSERT OR REPLACE INTO algorithms
  SELECT * FROM read_csv('algorithms.csv');

INSERT OR REPLACE INTO observable_data
  SELECT * FROM read_csv('observable_data.csv');
