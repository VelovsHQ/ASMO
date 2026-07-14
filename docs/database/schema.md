# ASMO Database Schema

## Tables

- users
- user_preferences
- sources
- articles
- ai_analyses
- markets
- predictions
- watchlists
- alerts

## sources

Purpose:
Stores all trusted news providers.

Columns:

- id (PK)
- name
- website_url
- rss_url
- country
- language
- credibility_score
- is_active
- created_at