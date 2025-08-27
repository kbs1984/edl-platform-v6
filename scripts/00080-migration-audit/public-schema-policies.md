# public schema

Filter tables and policies
Docs
admin

Enable RLS

Create policy

Warning:
Row Level Security is disabled. Your table is publicly readable and writable.
No policies created yet

bank_account

Enable RLS

Create policy

Warning:
Row Level Security is disabled. Your table is publicly readable and writable.
No policies created yet

friendship

Disable RLS

Create policy

INSERT


Allow insert on friendship
Applied to: authenticated role

SELECT


Allow select on friendship
Applied to: authenticated role

UPDATE


Allow update on friendship
Applied to: authenticated role

guardian

Disable RLS

Create policy

INSERT


Enable insert for authenticated users only
Applied to: authenticated role

SELECT


Enable read access for all users
Applied to: public role

guardian_request

Disable RLS

Create policy

Note:
Row Level Security is enabled, but no policies exist. No data will be selectable via Supabase APIs.
No policies created yet

guild

Enable RLS

Create policy

Warning:
Row Level Security is disabled. Your table is publicly readable and writable.
No policies created yet

guild_member

Enable RLS

Create policy

Warning:
Row Level Security is disabled. Your table is publicly readable and writable.
No policies created yet

invitation

Enable RLS

Create policy

Warning:
Row Level Security is disabled. Your table is publicly readable and writable.
No policies created yet

judge

Disable RLS

Create policy

INSERT


Enable insert for authenticated users only
Applied to: authenticated role

log

Enable RLS

Create policy

Warning:
Row Level Security is disabled. Your table is publicly readable and writable.
No policies created yet

payment_history

Enable RLS

Create policy

Warning:
Row Level Security is disabled. Your table is publicly readable and writable.
No policies created yet

profile

Disable RLS

Create policy

SELECT


Allow users to select their own profile
Applied to: authenticated role

UPDATE


Allow users to update their own profile
Applied to: authenticated role

SELECT


Enable read access for all users
Applied to: authenticated role

rating

Enable RLS

Create policy

Warning:
Row Level Security is disabled. Your table is publicly readable and writable.
No policies created yet

school

Disable RLS

Create policy

INSERT


Allow authenticated users to insert school
Applied to: authenticated role

SELECT


Enable read access for all users
Applied to: authenticated role

student

Disable RLS

Create policy

INSERT


Enable insert for authenticated users only
Applied to: authenticated role

SELECT


Enable read access for all users
Applied to: authenticated role

UPDATE


update_student_policy
Applied to: authenticated role

team

Disable RLS

Create policy

DELETE


Enable delete for users based on user_id
Applied to: authenticated role

INSERT


Enable insert for authenticated users only
Applied to: authenticated role

SELECT


Enable read access for all users
Applied to: authenticated role

UPDATE


Policy with table joins
Applied to: public role

team_member

Disable RLS

Create policy

DELETE


Enable delete for users based on user_id
Applied to: public role

INSERT


Enable insert for users based on user_id
Applied to: public role

SELECT


Enable read access for all users
Applied to: authenticated role

UPDATE


Enable update for users based on email
Applied to: public role