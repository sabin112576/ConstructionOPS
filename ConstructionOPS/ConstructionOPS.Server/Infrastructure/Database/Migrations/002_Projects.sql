-- =========================================================
-- 002 PROJECT DATABASE FUNCTIONS
-- ConstructionOPS
-- =========================================================


-- =========================================================
-- GET ALL PROJECTS
-- =========================================================

CREATE OR REPLACE FUNCTION projects.get_all(
    p_tenant_id UUID
)
RETURNS TABLE
(
    project_id UUID,
    tenant_id UUID,
    company_id UUID,
    client_id UUID,
    project_code VARCHAR,
    name VARCHAR,
    description TEXT,
    status SMALLINT,
    start_date DATE,
    planned_end_date DATE,
    actual_end_date DATE,
    contract_value NUMERIC(19,4),
    currency_code CHAR(3),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    client_name VARCHAR
)
LANGUAGE SQL
STABLE
AS
$$
    SELECT
        p.project_id,
        p.tenant_id,
        p.company_id,
        p.client_id,
        p.project_code,
        p.name,
        p.description,
        p.status,
        p.start_date,
        p.planned_end_date,
        p.actual_end_date,
        p.contract_value,
        p.currency_code,
        p.created_at,
        p.updated_at,
        c.name AS client_name
    FROM projects.project p
    INNER JOIN crm.client c
        ON c.client_id = p.client_id
    WHERE p.tenant_id = p_tenant_id
    ORDER BY p.created_at DESC;
$$;


-- =========================================================
-- GET PROJECT BY ID
-- =========================================================

CREATE OR REPLACE FUNCTION projects.get_by_id(
    p_tenant_id UUID,
    p_project_id UUID
)
RETURNS TABLE
(
    project_id UUID,
    tenant_id UUID,
    company_id UUID,
    client_id UUID,
    project_code VARCHAR,
    name VARCHAR,
    description TEXT,
    status SMALLINT,
    start_date DATE,
    planned_end_date DATE,
    actual_end_date DATE,
    contract_value NUMERIC(19,4),
    currency_code CHAR(3),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    client_name VARCHAR
)
LANGUAGE SQL
STABLE
AS
$$
    SELECT
        p.project_id,
        p.tenant_id,
        p.company_id,
        p.client_id,
        p.project_code,
        p.name,
        p.description,
        p.status,
        p.start_date,
        p.planned_end_date,
        p.actual_end_date,
        p.contract_value,
        p.currency_code,
        p.created_at,
        p.updated_at,
        c.name AS client_name
    FROM projects.project p
    INNER JOIN crm.client c
        ON c.client_id = p.client_id
    WHERE p.tenant_id = p_tenant_id
      AND p.project_id = p_project_id;
$$;


-- =========================================================
-- CHECK PROJECT CODE
-- =========================================================

CREATE OR REPLACE FUNCTION projects.exists(
    p_tenant_id UUID,
    p_project_code VARCHAR
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS
$$
    SELECT EXISTS
    (
        SELECT 1
        FROM projects.project
        WHERE tenant_id = p_tenant_id
          AND project_code = p_project_code
    );
$$;


-- =========================================================
-- CREATE PROJECT
-- =========================================================

CREATE OR REPLACE FUNCTION projects.create(
    p_project_id UUID,
    p_tenant_id UUID,
    p_company_id UUID,
    p_client_id UUID,
    p_project_code VARCHAR,
    p_name VARCHAR,
    p_description TEXT,
    p_status SMALLINT,
    p_start_date DATE,
    p_planned_end_date DATE,
    p_contract_value NUMERIC(19,4),
    p_currency_code CHAR(3)
)
RETURNS TABLE
(
    project_id UUID,
    tenant_id UUID,
    company_id UUID,
    client_id UUID,
    project_code VARCHAR,
    name VARCHAR,
    description TEXT,
    status SMALLINT,
    start_date DATE,
    planned_end_date DATE,
    actual_end_date DATE,
    contract_value NUMERIC(19,4),
    currency_code CHAR(3),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE SQL
VOLATILE
AS
$$
    INSERT INTO projects.project
    (
        project_id,
        tenant_id,
        company_id,
        client_id,
        project_code,
        name,
        description,
        status,
        start_date,
        planned_end_date,
        contract_value,
        currency_code
    )
    VALUES
    (
        p_project_id,
        p_tenant_id,
        p_company_id,
        p_client_id,
        p_project_code,
        p_name,
        p_description,
        p_status,
        p_start_date,
        p_planned_end_date,
        p_contract_value,
        p_currency_code
    )
    RETURNING
        projects.project.project_id,
        projects.project.tenant_id,
        projects.project.company_id,
        projects.project.client_id,
        projects.project.project_code,
        projects.project.name,
        projects.project.description,
        projects.project.status,
        projects.project.start_date,
        projects.project.planned_end_date,
        projects.project.actual_end_date,
        projects.project.contract_value,
        projects.project.currency_code,
        projects.project.created_at,
        projects.project.updated_at;
$$;