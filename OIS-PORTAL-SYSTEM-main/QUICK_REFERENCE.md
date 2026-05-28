# Unified Search Assistant — Quick Reference

## 🎯 What It Does

Searches 4 databases simultaneously and shows all matching records in ONE consolidated table.

## 🗄️ Databases

| # | Name | Records | Match Field |
|---|------|---------|-------------|
| 1 | **CAS** | Assistance requests | Requester |
| 2 | **Bedridden** | Equipment for patients | Patient / Claimant |
| 3 | **Device** | Device claims | Beneficiary |
| 4 | **Medicine** | Medicine distributions | Beneficiary |

## 🔍 How to Search

1. Open **Client Record Search**
2. Type a name: `"Juan Dela Cruz"` or just `"Juan"`
3. Press Enter or click **Search**
4. View all records from all 4 systems
5. Click **Export to Excel** to download

## 📊 Table Columns

| Column | What It Shows |
|--------|---|
| **System** | Which database (purple/teal/blue/amber) |
| **Date** | When the record was filed (Mon DD, YYYY) |
| **Name** | Person's name |
| **Record** | Type of request/device/medicine |
| **Category** | Purpose, occasion, or type |
| **Barangay** | Location (if available) |
| **Status** | Status with color badge |
| **Notes** | Additional info |

## 🎨 Status Colors

- **🟢 Green** = Done / Completed / Released
- **🟡 Yellow** = Pending
- **🔵 Blue** = In Progress
- **⚫ Gray** = Unknown

## 🏷️ System Colors

- **Purple** = CAS (Cong Assistance)
- **Teal** = Bedridden Requests
- **Blue** = Device Claims
- **Amber** = Medicine Claims

## 📁 CSV Files

```
data/
├── CAS_all_2026-05-08.csv
├── bedridden_requests.csv
├── device_claims.csv
└── medicine_claims.csv
```

## 📅 Date Format

All dates must be: `YYYY-MM-DD`  
Display format: `May 08, 2026`

## 🔑 Search Rules

✅ **Works:**
- `Juan` → finds Juan anywhere
- `Dela Cruz` → finds full names
- `juan` → case doesn't matter
- Partial names work

❌ **Doesn't work:**
- Empty search
- Symbols/special characters
- Leading/trailing spaces (auto-trimmed)

## 💾 Add New Data

1. Edit CSV file in Excel
2. Save as CSV
3. Upload to `data/` folder
4. Refresh browser

**Keep same column names!**

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| No results | Check spelling, try partial name |
| Slow search | Wait for first load, cache kicks in |
| Export not working | Check if results display, try different browser |
| Data looks wrong | Check CSV format, verify dates are YYYY-MM-DD |

## 📋 CSV Column Requirements

### CAS
```
Type, Requester, Barangay, Purpose/Occasion, Amount, Status, Date Filed, Encoder, Notes, Contact, Event Date
```

### Bedridden
```
Patient, Claimant, Barangay, Address, Contact, Category, Status, Date Filed, Date Given, Delivered By, Notes
```

### Device
```
Beneficiary, Device, Category, Qty, ClaimType, ReturnDate, Date, Encoder
```

### Medicine
```
Beneficiary, Medicine, Dosage, Type, Qty, Pieces, Date, Encoder
```

## 🚀 Features

- ⚡ **Fast** — < 100ms search
- 🔄 **Hybrid** — Falls back to Firestore if needed
- 📥 **Exportable** — Download as CSV
- 📱 **Responsive** — Works on phone/tablet
- 🎨 **Color-coded** — Easy to scan
- 🔤 **Flexible** — Any name order, any case

## 📞 Support

Need help? Check:
1. **UNIFIED_SEARCH_GUIDE.md** — Full documentation
2. **IMPLEMENTATION_SUMMARY.md** — Technical details
3. Browser console (F12) — Error messages

---

**Quick Tip**: If search returns no results, check if the exact spelling exists in the CSV file. Copy-paste the name from Excel if unsure!
