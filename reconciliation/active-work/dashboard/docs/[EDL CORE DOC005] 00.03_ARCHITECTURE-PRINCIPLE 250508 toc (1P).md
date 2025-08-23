---
session: "25050"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "00.03_ARCHITECTURE-PRINCIPLES"
purpose: "Document 00.03_architecture-principles"
topics: ['auth', 'documentation']
priority: "P1"
domain: "reconciliation"
---

EDL 00_PROJECT-OVERVIEW/

# 00.03_ARCHITECTURE-PRINCIPLES

## 0. 00.03 Table of Contents

1. Overview
2. Core Architectural Principles
   2.1 Supabase-First Architecture
   2.2 Separation of Concerns
   2.3 Dependency Inversion
   2.4 Simplicity and Minimalism
   2.5 Schema Organization and Cross-Schema Relationships
3. Security Principles
   3.1 Row-Level Security (RLS)
   3.2 Authentication and Authorization
4. Data Management Principles
   4.1 Data as an Asset
   4.2 Real-time Data Synchronization
5. Development Principles
   5.1 Iterative Development
   5.2 Performance by Design
6. Integration Principles
   6.1 Component-Based Architecture
   6.2 Technology Integration
7. Conclusion

## 1. Overview

This document outlines the core architectural principles that govern the EDL (Emdash Debate League) platform. These principles serve as foundational guidelines for all design and implementation decisions across the platform, ensuring consistency, maintainability, and alignment with business objectives.

## 2. Core Architectural Principles

### 2.1 Supabase-First Architecture

The EDL platform follows a Supabase-first approach, where Supabase serves as the exclusive database technology. This principle guides all data operations, authentication flows, and storage mechanisms, ensuring that we leverage the native capabilities of Supabase throughout the platform.

Key aspects:
- All database interactions use Supabase's PostgreSQL capabilities
- Authentication leverages Supabase Auth with JWT-based sessions
- File storage utilizes Supabase Storage for video and asset management
- Real-time features use Supabase's subscription capabilities

### 2.2 Separation of Concerns

The EDL platform strictly adheres to separation of concerns, where software is separated based on the kinds of work it performs. This principle asserts that different parts of an application should be separated based on their responsibilities.

Implementation guidelines:
- Multi-schema approach: `public` schema for user management, `debate` schema for debate-specific functionality
- Logical separation between database operations, business logic, and presentation
- Clear boundaries between components with well-defined interfaces
- Each component should have a single responsibility

### 2.3 Dependency Inversion

Components should depend on abstractions, not concrete implementations. This principle promotes loose coupling and modularity, making the application more testable and maintainable.

Implementation guidelines:
- Use interface-based design in complex components
- Higher-level modules should not depend on lower-level modules
- Leverage Supabase's client abstraction for database operations
- Implement proper dependency injection patterns in component design

### 2.4 Simplicity and Minimalism

The EDL platform emphasizes simplicity in design. Complex architectures can lead to confusion, slow down development, and increase risks. As reflected in principles like KISS (Keep It Simple) and "Everything should be made as simple as possible but not simpler," we strive to use the simplest solution that accomplishes the job.

Implementation guidelines:
- Choose the simplest effective solution for each problem
- Avoid over-engineering and premature optimization
- Prefer standardized patterns over custom implementations
- Follow the "Crawl, Walk, Run" approach to iterative development

### 2.5 Schema Organization and Cross-Schema Relationships

The EDL platform uses a deliberate schema organization strategy:

- **Public Schema**: Contains user management, authentication, team organization, and general platform structures
- **Debate Schema**: Contains formats, rounds, motions, evaluation systems, and debate content
- **Cross-Schema Relationships**: Well-defined relationships between schemas with proper foreign key constraints

Implementation guidelines:
- Always use schema prefixes when accessing tables
- Implement proper RLS policies for cross-schema access control
- Follow consistent naming conventions across schemas
- Use appropriate indexes for cross-schema relationships

## 3. Security Principles

### 3.1 Row-Level Security (RLS)

Security is primarily implemented through Supabase's Row-Level Security (RLS) policies, ensuring that users can only access data they're authorized to see regardless of how it's accessed.

Implementation guidelines:
- Implement RLS policies for all tables
- Follow the principle of least privilege
- Base access control on user identity and roles
- Test security policies extensively

### 3.2 Authentication and Authorization

The EDL platform follows these authentication and authorization principles:

- Use Supabase Auth for all authentication flows
- JWT-based session management
- Role-based access control for authorization
- Clear separation between authentication and authorization

## 4. Data Management Principles

### 4.1 Data as an Asset

Data is a valuable asset of the EDL platform. This is one of three closely related principles: data is an asset; data is shared; and data is easily accessible.

Implementation guidelines:
- Prioritize data integrity and quality
- Implement proper validation on all data operations
- Design for data analytics and insights
- Maintain historical data appropriately

### 4.2 Real-time Data Synchronization

The EDL platform leverages real-time capabilities for certain features:

- Use Supabase's real-time subscriptions for live debate updates
- Implement proper presence tracking for participant status
- Design for both synchronous and asynchronous debate flows
- Ensure consistent state across clients

## 5. Development Principles

### 5.1 Iterative Development

The EDL platform follows an iterative development approach: "Crawl, walk, run. In other words, make it work, make it better, make it great."

Implementation guidelines:
- Start with minimal viable implementations
- Refine based on feedback and real-world usage
- Continuously improve performance and user experience
- Use analytics to guide refinements

### 5.2 Performance by Design

Performance considerations are built into the architecture from the beginning. The way a software architecture influences performance parameters dictates the long-term efficiency of the platform.

Implementation guidelines:
- Design for optimal query performance
- Implement appropriate caching strategies
- Monitor and benchmark system performance
- Optimize for common use cases

## 6. Integration Principles

### 6.1 Component-Based Architecture

The EDL platform uses a component-based architecture with "a lexicon of components and connectors with rules on how they can be combined" to create a maintainable and extensible system.

Implementation guidelines:
- Design reusable components with well-defined interfaces
- Ensure components are replaceable and modular
- Document component interactions clearly
- Test components both individually and in integration

### 6.2 Technology Integration

The EDL platform integrates multiple technologies:

- Supabase as the database foundation
- Noodl for frontend development
- n8n for workflow automation
- NextJS/Tailwind for specific components

Implementation guidelines:
- Clearly define integration points between technologies
- Follow consistent patterns for cross-technology communication
- Document integration requirements and dependencies
- Test integrations thoroughly

## 7. Conclusion

These architectural principles serve as the foundation for all development on the EDL platform. By adhering to these principles, we ensure a consistent, maintainable, and scalable platform that meets both current and future requirements.

All technical decisions should be evaluated against these principles, and any deviation should be explicitly justified and documented.