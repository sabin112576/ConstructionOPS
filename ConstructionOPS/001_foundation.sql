CREATE DATABASE constructionops;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS organization;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS projects;
CREATE SCHEMA IF NOT EXISTS audit;


CREATE TABLE organization.tenant
(
    tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,

    currency_code CHAR(3) NOT NULL DEFAULT 'INR',
    timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,

    CONSTRAINT uq_tenant_code
        UNIQUE (code)
);

CREATE TABLE organization.company
(
    company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL,

    name VARCHAR(200) NOT NULL,
    legal_name VARCHAR(250),

    tax_number VARCHAR(100),

    email VARCHAR(200),
    phone VARCHAR(50),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,

    CONSTRAINT fk_company_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES organization.tenant(tenant_id)
);


CREATE TABLE crm.client
(
    client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL,

    client_code VARCHAR(50) NOT NULL,
    name VARCHAR(250) NOT NULL,

    email VARCHAR(200),
    phone VARCHAR(50),

    tax_number VARCHAR(100),

    status SMALLINT NOT NULL DEFAULT 1,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,

    CONSTRAINT fk_client_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES organization.tenant(tenant_id),

    CONSTRAINT uq_client_code
        UNIQUE (tenant_id, client_code)
);

CREATE TABLE projects.project
(
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL,
    company_id UUID NOT NULL,
    client_id UUID NOT NULL,

    project_code VARCHAR(50) NOT NULL,
    name VARCHAR(250) NOT NULL,

    description TEXT,

    status SMALLINT NOT NULL DEFAULT 1,

    start_date DATE,
    planned_end_date DATE,
    actual_end_date DATE,

    contract_value NUMERIC(19,4) NOT NULL DEFAULT 0,

    currency_code CHAR(3) NOT NULL DEFAULT 'INR',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,

    CONSTRAINT fk_project_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES organization.tenant(tenant_id),

    CONSTRAINT fk_project_company
        FOREIGN KEY (company_id)
        REFERENCES organization.company(company_id),

    CONSTRAINT fk_project_client
        FOREIGN KEY (client_id)
        REFERENCES crm.client(client_id),

    CONSTRAINT uq_project_code
        UNIQUE (tenant_id, project_code),

    CONSTRAINT ck_project_contract_value
        CHECK (contract_value >= 0),

    CONSTRAINT ck_project_dates
        CHECK (
            planned_end_date IS NULL
            OR start_date IS NULL
            OR planned_end_date >= start_date
        )
);

CREATE INDEX ix_project_tenant
ON projects.project(tenant_id);

CREATE INDEX ix_project_client
ON projects.project(tenant_id, client_id);

CREATE INDEX ix_project_status
ON projects.project(tenant_id, status);


INSERT INTO organization.tenant
(
    code,
    name
)
VALUES
(
    'DEMO',
    'ConstructionOPS Demo'
)
RETURNING tenant_id;


INSERT INTO organization.company
(
    tenant_id,
    name,
    legal_name
)
VALUES
(
    'TENANT_ID',
    'ConstructionOPS Builders',
    'ConstructionOPS Builders Pvt Ltd'
)
RETURNING company_id;


INSERT INTO crm.client
(
    tenant_id,
    client_code,
    name,
    email,
    phone
)
VALUES
(
    'TENANT_ID',
    'CLI-001',
    'ABC Developers',
    'client@example.com',
    '9876543210'
)
RETURNING client_id;