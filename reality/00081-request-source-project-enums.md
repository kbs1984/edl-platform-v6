---
session: "00081"
type: "reality-snapshot"
status: "reference"
created: "2025-08-27"
title: "Source Project Enums Reference"
purpose: "Document enum types in the source project we're replicating"
topics: ["database", "enums", "reality", "source-project", "types"]
priority: "P0"
domain: "reality"
reality_type: "source-reference"
source: "sean2474-emdash-debate"
---
Database Enumerated Types
Custom data types that you can use in your database tables or functions.

schema

public

Search for a type
Docs

Create type
Schema	Name	Values	
public

debate_session_status	SCHEDULED, ONGOING, COMPLETED, CANCELLED	

public

status	PENDING, ACCEPTED, REJECTED, EXPIRED, CANCELLED	

public

group_type	GUILD, TEAM	

public

gender	MALE, FEMALE, do not wish to specify	

public

log_type	REQUEST_JOIN, JOINED, LEFT, INVITED, KICKED, UPDATED, DELETED, CREATED	

public

payment_provider	TOSS, NAVER_PAY, KAKAO_PAY	

public

division	VILLIGER, LOWER, UPPER, SENIOR, OPEN	

public

user_role_type	STUDENT, JUDGE, GUARDIAN	

public

payment_state	REQUESTED, PENDING, FAILED, COMPLETED, AUTHORIZED, ABANDONED, REFUNDED, PREAPPROVED	

public

debate_ballot_status_enum	PENDING, IN_PROGRESS, COMPLETE