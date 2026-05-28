# Unified Search Assistant — OIS Portal

## Overview

The Unified Search Assistant is an integrated component of the OIS Portal that searches across four interconnected databases and returns a single consolidated table of all records linked to a person by name.

## Supported Databases

### 1. **CAS** — Cong Assistance Request System
- **File**: `data/CAS_all_2026-05-08.csv`
- **Match Field**: Requester
- **Record Types**: Cake Request, Medical Assistance, Tuition Assistance, and others
- **Statuses**: Completed, Pending, In Progress

### 2. **Bedridden Requests**
- **File**: `data/bedridden_requests.csv`
- **Match Fields**: Patient OR Claimant
- **Categories**: Tungkod/Cane, Wheelchair, BP Monitor (Digital/Manual), Nebulizer, Glucometer, Folding Bed, Oxygen, Walker, Hearing Aid, Other
- **Statuses**: Pending, Done, In Progress

### 3. **Device Claims**
- **File**: `data/device_claims.csv`
- **Match Field**: Beneficiary
- **Categories**: Wheelchair, Walker, Mobility Aids
- **Claim Types**: Released, Returned

### 4. **Medicine Claims**
- **File**: `data/medicine_claims.csv`
- **Match Field**: Beneficiary
- **Types**: Box, Bottle, Sachet, Tablet

## Search Behavior

### How It Works

1. **Case-Insensitive Partial Matching**: When a user enters a search term, the system searches all four databases using case-insensitive partial matching
2. **Multi-Field Matching**: Records match if the search term appears anywhere in the designated name fields
3. **Simultaneous Search**: All four databases are searched at the same time
4. **Consolidated Results**: All matching records are merged into a single chronological table

### Search Examples

- Search: `Juan` → Finds all records where Juan appears in Requester, Patient, Claimant, or Beneficiary fields
- Search: `2026040001` → Searches by Client ID (Firestore database)
- Search: `Dela Cruz` → Finds full name or partial name matches

## Result Display Format

### Summary Bar
```
Results for "Juan Dela Cruz"
[Total: 5 records] [CAS: 1] [Bedridden: 2] [Device: 1] [Medicine: 1]
```

### Unified Table Columns

| Column | Description |
|--------|-------------|
| **System** | Color-coded system identifier (CAS, Bedridden, Device, Medicine) |
| **Date** | Date Filed / Date (formatted as `Mon DD, YYYY`) |
| **Name / Patient** | The matched person's name |
| **Record / Request** | Type, device name, or medicine name |
| **Category / Purpose** | Purpose, occasion, category, or medicine type |
| **Barangay** | Barangay (if available) |
| **Status** | Color-coded status badge |
| **Notes** | Any notes or encoder info |

### Status Badge Colors

- **Green**: Done, Completed, Released
- **Yellow**: Pending
- **Blue**: In Progress
- **Gray**: Unknown/Default

### System Colors

- **Purple**: CAS (Cong Assistance)
- **Teal**: Bedridden Requests
- **Blue**: Device Claims
- **Amber**: Medicine Claims

## CSV Data Format

### CAS File Structure
```csv
Type,Requester,Barangay,Purpose/Occasion,Amount,Status,Date Filed,Encoder,Notes,Contact,Event Date
```

### Bedridden File Structure
```csv
Patient,Claimant,Barangay,Address,Contact,Category,Status,Date Filed,Date Given,Delivered By,Notes
```

### Device Claims File Structure
```csv
Beneficiary,Device,Category,Qty,ClaimType,ReturnDate,Date,Encoder
```

### Medicine Claims File Structure
```csv
Beneficiary,Medicine,Dosage,Type,Qty,Pieces,Date,Encoder
```

## Features

### ✅ What Works

- **Multi-Database Search**: Searches across all four systems simultaneously
- **Instant Results**: Uses client-side CSV parsing for fast searches
- **Chronological Sorting**: Results sorted by date (newest first)
- **Export to Excel**: Download consolidated results as CSV file
- **Responsive Design**: Works on desktop and mobile devices
- **Color-Coded Organization**: Easy visual distinction between systems
- **Fallback Search**: Falls back to Firestore if CSV search returns no results

### 🔄 Hybrid Search System

1. **Primary**: Unified CSV search (CAS, Bedridden, Device, Medicine)
2. **Fallback**: Firestore client database search
3. **Result Priority**: Shows CSV results first, then Firestore results if no CSV matches found

## Implementation Details

### Files Involved

```
client.html              # Main search page (HTML + embedded styles/scripts)
js/unified-search.js    # UnifiedSearchAssistant class (ES6 module)
data/CAS_all_2026-05-08.csv
data/bedridden_requests.csv
data/device_claims.csv
data/medicine_claims.csv
```

### How to Update CSV Data

1. Replace the CSV files in the `data/` folder
2. Maintain the same column headers and order
3. Use dates in `YYYY-MM-DD` format
4. Enclose values with commas in quotes: `"value, with comma"`

### JavaScript Integration

```javascript
// Import the module
import { unifiedSearch } from "./js/unified-search.js";

// Load databases
await unifiedSearch.loadDatabases();

// Perform search
const results = unifiedSearch.search("search term");

// Check results
if (results.success) {
  // Display results table
} else {
  // Show "no records found" message
}
```

## Error Handling

### "No records found for [name]"
- Possible causes: Spelling error, data not encoded yet, different name format
- Solution: Check spelling, try partial name, contact office if data should exist

### CSV File Not Loading
- Possible causes: File not found, wrong file path, network error
- Solution: Verify file exists in `data/` folder, check browser console for errors

### Slow Search
- Cause: Large CSV files loading for the first time
- Solution: Results cache after initial load, subsequent searches are instant

## User Guide

### Basic Search Steps

1. Go to **OIS Portal** → **Client Record Search**
2. Enter a name (first name, last name, or full name) or search term
3. Click **Search** or press Enter
4. View consolidated results from all systems
5. Click **Export to Excel** to download results
6. Click **Search Again** to perform another search

### Tips

- **Partial Names Work**: `"Juan"` will find `"Juan Dela Cruz"`
- **Name Order Doesn't Matter**: `"Juan Dela Cruz"` and `"Dela Cruz Juan"` both work
- **Case Insensitive**: `"juan"`, `"JUAN"`, and `"Juan"` all find the same records
- **Check Multiple Columns**: Pay attention to the "System" column to understand which database each record came from

## Database Maintenance

### Adding New Records

1. Edit the CSV file in your spreadsheet application
2. Add new rows maintaining the same column structure
3. Save as CSV format
4. Upload to `data/` folder
5. Refresh the browser to load updated data

### Regular Updates

- **CAS**: Update when new requests are filed
- **Bedridden**: Update when devices are issued or claimed
- **Device Claims**: Update when devices are released or returned
- **Medicine Claims**: Update when medicines are distributed

## Performance Notes

- **CSV Size**: Current system handles files up to ~10,000 rows efficiently
- **Search Speed**: < 100ms for typical searches
- **Memory**: Databases are loaded once on page load and cached
- **Compatibility**: Works in all modern browsers with ES6 module support

## Troubleshooting

### Issue: Search returns no results
**Solution**: 
- Check spelling of name
- Try partial name search
- Verify data exists in CSV files
- Check browser console for errors

### Issue: Data looks incorrect
**Solution**:
- Verify CSV file structure matches specification
- Ensure dates are in `YYYY-MM-DD` format
- Check for encoding issues in special characters

### Issue: Export not working
**Solution**:
- Check browser console for errors
- Verify browser allows downloads
- Try different browser if issue persists

## Support & Maintenance

For questions or updates:
- Contact: Office Information System Administrator
- Issues: Check the data directory and CSV formatting
- Backup: Keep regular backups of CSV data files

---

**Last Updated**: May 8, 2026  
**System**: OIS Portal — Unified Search Assistant v1.0
