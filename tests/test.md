# Testing

This folder contains test scripts for the Purchase Order Management System.

## Prerequisites

- Backend server running on `http://localhost:8000`
- Python environment with `requests` package installed

## Available Tests

### Verify Workflow

End-to-end workflow test that validates the complete flow:
1. Email parsing
2. Order saving
3. Order listing
4. Status updates

```bash
python tests/verify_workflow.py
```

### Email Parsing Benchmark

Runs parsing against all sample emails in `test_emails.md` and reports success rate:

```bash
python tests/test_parsing.py
```

**Target:** 98% success rate

## Test Data

- `test_emails.md` - Collection of sample emails in various formats for testing the parser
