-- Federated Analysis Types Database Schema
-- DuckDB implementation with semantic text IDs

-- ============================================================================
-- STATISTICS
-- ============================================================================

CREATE TYPE output_type AS ENUM (
    'scalar',
    'vector',
    'matrix',
    'distribution',
    'model'
);

CREATE TABLE statistics (
    statistic_id VARCHAR PRIMARY KEY,
    description TEXT NOT NULL,
    output output_type NOT NULL,
    statbarn_id VARCHAR,  -- Reference to disclosure risk framework
    mathjax TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Aliases for statistics (with primary name indicator)
CREATE TABLE statistic_aliases (
    statistic_id VARCHAR NOT NULL REFERENCES statistics(statistic_id),
    alias_name VARCHAR NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (statistic_id, alias_name)
);

-- Relationships between statistics
CREATE TYPE relationship_type AS ENUM (
    'approximates',
    'generalizes',
    'special_case_of',
    'equivalent_to',
    'subsumes'
);

CREATE TABLE statistic_relationships (
    relationship_id VARCHAR PRIMARY KEY,
    source_statistic_id VARCHAR NOT NULL REFERENCES statistics(statistic_id),
    target_statistic_id VARCHAR NOT NULL REFERENCES statistics(statistic_id),
    relationship_type relationship_type NOT NULL,
    description TEXT,
    CHECK (source_statistic_id != target_statistic_id)
);

-- ============================================================================
-- ALGORITHMS
-- ============================================================================

CREATE TYPE separability_type AS ENUM (
    'none',
    'fully',
    'iterative'
);

CREATE TYPE communication_direction AS ENUM (
    'client_to_aggregator',
    'bidirectional'
);

CREATE TYPE privacy_encryption_level AS ENUM (
    'compatible',
    'required',
    'none'
);

CREATE TABLE algorithms (
    algorithm_id VARCHAR PRIMARY KEY,
    statistic_id VARCHAR NOT NULL REFERENCES statistics(statistic_id),
    name VARCHAR NOT NULL,
    description TEXT,
    separability separability_type NOT NULL,
    mathjax TEXT,
    communication_rounds INTEGER,  -- NULL for adaptive
    adaptive_rounds BOOLEAN DEFAULT FALSE,
    communication_direction communication_direction NOT NULL,
    requires_branching BOOLEAN DEFAULT FALSE,
    requires_persistence BOOLEAN DEFAULT FALSE,
    differential_privacy VARCHAR,
    homomorphic_encryption privacy_encryption_level DEFAULT 'none',
    multiparty_computation privacy_encryption_level DEFAULT 'none',
    computational_complexity VARCHAR,  -- e.g., 'O(n)', 'O(n log n)'
    communication_complexity VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- What information is observable by different node types
CREATE TYPE node_type AS ENUM (
    'aggregator',
    'client',
    'coordinator',
    'other'
);

CREATE TABLE observable_data (
    observable_id VARCHAR PRIMARY KEY,
    algorithm_id VARCHAR NOT NULL REFERENCES algorithms(algorithm_id),
    node_type node_type NOT NULL,
    item TEXT NOT NULL,  -- Specific piece of observable information
    description TEXT
);

-- Algorithm parameters
CREATE TABLE algorithm_parameters (
    parameter_id VARCHAR PRIMARY KEY,
    algorithm_id VARCHAR NOT NULL REFERENCES algorithms(algorithm_id),
    parameter_name VARCHAR NOT NULL,
    parameter_type VARCHAR NOT NULL,  -- e.g., 'float', 'integer', 'boolean'
    required BOOLEAN DEFAULT TRUE,
    default_value VARCHAR,
    description TEXT,
    UNIQUE (algorithm_id, parameter_name)
);

-- ============================================================================
-- IMPLEMENTATIONS
-- ============================================================================

CREATE TYPE implementation_status AS ENUM (
    'experimental',
    'stable',
    'deprecated'
);

CREATE TABLE implementations (
    implementation_id VARCHAR PRIMARY KEY,
    algorithm_id VARCHAR NOT NULL REFERENCES algorithms(algorithm_id),
    language VARCHAR NOT NULL,  -- Python, R, Julia, etc.
    library_name VARCHAR,
    repository_url VARCHAR,
    version VARCHAR,
    status implementation_status DEFAULT 'experimental',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- REFERENCES
-- ============================================================================

CREATE TABLE reference_docs (
    reference_id VARCHAR PRIMARY KEY,
    algorithm_id VARCHAR NOT NULL REFERENCES algorithms(algorithm_id),
    name VARCHAR NOT NULL,  -- Short citation name
    year INTEGER,
    doi VARCHAR,
    url VARCHAR,
    bibtex TEXT,
    abstract TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_algorithms_statistic ON algorithms(statistic_id);
CREATE INDEX idx_statistic_relationships_source ON statistic_relationships(source_statistic_id);
CREATE INDEX idx_statistic_relationships_target ON statistic_relationships(target_statistic_id);
CREATE INDEX idx_observable_data_algorithm ON observable_data(algorithm_id);
CREATE INDEX idx_algorithm_parameters_algorithm ON algorithm_parameters(algorithm_id);
CREATE INDEX idx_implementations_algorithm ON implementations(algorithm_id);
CREATE INDEX idx_references_algorithm ON reference_docs(algorithm_id);
CREATE INDEX idx_statistic_aliases_statistic ON statistic_aliases(statistic_id);

-- ============================================================================
-- VIEWS (HELPFUL QUERIES)
-- ============================================================================

-- View to get statistics with their primary alias
CREATE VIEW statistics_with_primary_name AS
SELECT 
    s.statistic_id,
    sa.alias_name AS primary_name,
    s.description,
    s.output,
    s.statbarn_id,
    s.mathjax
FROM statistics s
LEFT JOIN statistic_aliases sa 
    ON s.statistic_id = sa.statistic_id 
    AND sa.is_primary = TRUE;

-- View to get all aliases for each statistic
CREATE VIEW statistics_all_names AS
SELECT 
    s.statistic_id,
    s.description,
    s.output,
    STRING_AGG(sa.alias_name, ', ' ORDER BY sa.is_primary DESC, sa.alias_name) AS all_names
FROM statistics s
LEFT JOIN statistic_aliases sa ON s.statistic_id = sa.statistic_id
GROUP BY s.statistic_id, s.description, s.output;

-- View for algorithm summary with statistic name
CREATE VIEW algorithm_summary AS
SELECT 
    a.algorithm_id,
    a.name AS algorithm_name,
    sw.primary_name AS statistic_name,
    a.separability,
    a.communication_rounds,
    a.adaptive_rounds,
    a.differential_privacy,
    a.homomorphic_encryption,
    a.multiparty_computation
FROM algorithms a
JOIN statistics_with_primary_name sw ON a.statistic_id = sw.statistic_id;
