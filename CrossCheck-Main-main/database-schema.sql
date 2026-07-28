-- CrossCheck production-oriented MySQL schema reference.
CREATE DATABASE IF NOT EXISTS crosscheck;
USE crosscheck;
CREATE TABLE companies (id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(180) NOT NULL, domain VARCHAR(180), plan VARCHAR(50), status VARCHAR(30), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE roles (id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(40) UNIQUE NOT NULL, permissions JSON, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE users (id BIGINT PRIMARY KEY AUTO_INCREMENT, company_id BIGINT, role_id BIGINT, name VARCHAR(120) NOT NULL, email VARCHAR(180) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(company_id) REFERENCES companies(id), FOREIGN KEY(role_id) REFERENCES roles(id));
CREATE TABLE candidates (id BIGINT PRIMARY KEY AUTO_INCREMENT, company_id BIGINT, created_by BIGINT, created_by_name VARCHAR(150), name VARCHAR(150), photo_data LONGTEXT, photo_file_name VARCHAR(255), email VARCHAR(180), mobile_number VARCHAR(20), position VARCHAR(150), experience_years DECIMAL(5,2), skills TEXT, education VARCHAR(200), current_company VARCHAR(180), previous_company VARCHAR(180), notice_period_days INT, expected_salary DECIMAL(14,2), current_salary DECIMAL(14,2), risk_score INT, risk_level VARCHAR(20), joining_probability INT, verification_status VARCHAR(30), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
CREATE TABLE employment_history (id BIGINT PRIMARY KEY AUTO_INCREMENT, candidate_id BIGINT NOT NULL, company_name VARCHAR(180), designation VARCHAR(150), joining_date DATE, relieving_date DATE, employment_gap_months INT, status VARCHAR(30), verifier_remarks TEXT, FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE);
CREATE TABLE education (id BIGINT PRIMARY KEY AUTO_INCREMENT, candidate_id BIGINT NOT NULL, degree VARCHAR(150), university VARCHAR(180), passing_year VARCHAR(10), marks VARCHAR(30), status VARCHAR(30), FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE);
CREATE TABLE documents (id BIGINT PRIMARY KEY AUTO_INCREMENT, candidate_id BIGINT NOT NULL, type VARCHAR(60), file_name VARCHAR(255), file_path VARCHAR(500), hash_value VARCHAR(255), status VARCHAR(30), uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE);
CREATE TABLE identity_verification (id BIGINT PRIMARY KEY AUTO_INCREMENT, candidate_id BIGINT NOT NULL, aadhaar_status VARCHAR(30), pan_status VARCHAR(30), passport_status VARCHAR(30), remarks TEXT, verified_at TIMESTAMP NULL, FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE);
CREATE TABLE employment_verification (id BIGINT PRIMARY KEY AUTO_INCREMENT, candidate_id BIGINT NOT NULL, current_company_status VARCHAR(30), previous_company_status VARCHAR(30), joining_date_status VARCHAR(30), relieving_date_status VARCHAR(30), employment_gap_status VARCHAR(30), final_status VARCHAR(30), FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE);
CREATE TABLE education_verification (id BIGINT PRIMARY KEY AUTO_INCREMENT, candidate_id BIGINT NOT NULL, degree_status VARCHAR(30), university_status VARCHAR(30), year_status VARCHAR(30), marks_status VARCHAR(30), final_status VARCHAR(30), FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE);
CREATE TABLE offer_history (id BIGINT PRIMARY KEY AUTO_INCREMENT, candidate_id BIGINT NOT NULL, company_name VARCHAR(180), offered_role VARCHAR(150), offer_date DATE, salary DECIMAL(14,2), active BOOLEAN, acceptance_status VARCHAR(30), FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE);
CREATE TABLE risk_assessment (id BIGINT PRIMARY KEY AUTO_INCREMENT, candidate_id BIGINT NOT NULL, fake_experience_score INT, gap_score INT, switching_score INT, education_score INT, identity_score INT, multiple_offer_score INT, resume_mismatch_score INT, background_score INT, reference_score INT, notice_score INT, total_score INT, risk_level VARCHAR(20), assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE);
CREATE TABLE ai_recommendation (id BIGINT PRIMARY KEY AUTO_INCREMENT, candidate_id BIGINT NOT NULL, joining_probability INT, recommendation VARCHAR(100), explanation TEXT, model_version VARCHAR(40), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE);
CREATE TABLE notifications (id BIGINT PRIMARY KEY AUTO_INCREMENT, user_id BIGINT, title VARCHAR(180), message TEXT, channel VARCHAR(30), level VARCHAR(20), read_status BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE reports (id BIGINT PRIMARY KEY AUTO_INCREMENT, candidate_id BIGINT NOT NULL, report_path VARCHAR(500), final_decision VARCHAR(100), generated_by BIGINT, generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE);
CREATE TABLE audit_logs (id BIGINT PRIMARY KEY AUTO_INCREMENT, user_name VARCHAR(150), action VARCHAR(100), entity_type VARCHAR(80), entity_id VARCHAR(80), details TEXT, ip_address VARCHAR(60), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE api_keys (id BIGINT PRIMARY KEY AUTO_INCREMENT, company_id BIGINT, provider VARCHAR(100), api_key_encrypted TEXT, active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE verification_providers (id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(180), service_type VARCHAR(100), endpoint VARCHAR(500), active BOOLEAN DEFAULT TRUE);
CREATE TABLE subscription_plans (id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100), candidate_limit INT, monthly_price DECIMAL(12,2), features JSON, active BOOLEAN DEFAULT TRUE);

-- Identity verification fields added in the candidate onboarding flow
ALTER TABLE candidates ADD COLUMN aadhaar_number VARCHAR(12);
ALTER TABLE candidates ADD COLUMN pan_number VARCHAR(10);
ALTER TABLE candidates ADD COLUMN passport_number VARCHAR(20);
ALTER TABLE candidates ADD COLUMN aadhaar_document_data LONGTEXT;
ALTER TABLE candidates ADD COLUMN aadhaar_document_name VARCHAR(255);
ALTER TABLE candidates ADD COLUMN pan_document_data LONGTEXT;
ALTER TABLE candidates ADD COLUMN pan_document_name VARCHAR(255);
ALTER TABLE candidates ADD COLUMN passport_document_data LONGTEXT;
ALTER TABLE candidates ADD COLUMN passport_document_name VARCHAR(255);


-- Offer letter verification fields
ALTER TABLE candidates ADD COLUMN offer_company_name VARCHAR(180);
ALTER TABLE candidates ADD COLUMN offer_candidate_name VARCHAR(150);
ALTER TABLE candidates ADD COLUMN offer_position VARCHAR(150);
ALTER TABLE candidates ADD COLUMN offer_reference_number VARCHAR(120);
ALTER TABLE candidates ADD COLUMN offer_salary VARCHAR(80);
ALTER TABLE candidates ADD COLUMN offer_date DATE;
ALTER TABLE candidates ADD COLUMN proposed_joining_date DATE;
ALTER TABLE candidates ADD COLUMN offer_letter_data LONGTEXT;
ALTER TABLE candidates ADD COLUMN offer_letter_name VARCHAR(255);
ALTER TABLE candidates ADD COLUMN offer_letter_status VARCHAR(30) DEFAULT 'PENDING';
ALTER TABLE candidates ADD COLUMN offer_verification_remarks TEXT;
ALTER TABLE candidates ADD COLUMN offer_verified_by VARCHAR(150);
ALTER TABLE candidates ADD COLUMN offer_verified_at TIMESTAMP NULL;
