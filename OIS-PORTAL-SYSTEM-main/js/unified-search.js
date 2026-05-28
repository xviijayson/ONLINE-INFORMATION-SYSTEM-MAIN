// ===== UNIFIED SEARCH ASSISTANT =====
// Searches across four interconnected databases and returns consolidated records

class UnifiedSearchAssistant {
  constructor() {
    this.databases = {
      cas: { data: [], system: 'CAS', color: '#7c3aed', label: 'Cong Assistance' },
      bedridden: { data: [], system: 'Bedridden', color: '#0d9488', label: 'Bedridden Requests' },
      devices: { data: [], system: 'Device', color: '#0ea5e9', label: 'Device Claims' },
      medicines: { data: [], system: 'Medicine', color: '#f59e0b', label: 'Medicine Claims' }
    };
    this.ready = false;
  }

  // Parse CSV string into array of objects
  parseCSV(csvText, headers) {
    const lines = csvText.trim().split('\n');
    if (!headers || headers.length === 0) {
      headers = lines[0].split(',').map(h => h.trim());
      lines.shift();
    }
    
    return lines
      .filter(line => line.trim())
      .map(line => {
        const values = this.parseCSVLine(line);
        const obj = {};
        headers.forEach((header, idx) => {
          obj[header] = values[idx]?.trim() || '';
        });
        return obj;
      });
  }

  // Parse individual CSV line handling quoted values
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  // Load all databases from CSV files
  async loadDatabases() {
    try {
      const csvFiles = {
        cas: 'data/CAS_all_2026-05-08.csv',
        bedridden: 'data/bedridden_requests.csv',
        devices: 'data/device_claims.csv',
        medicines: 'data/medicine_claims.csv'
      };

      for (const [key, file] of Object.entries(csvFiles)) {
        try {
          const response = await fetch(file);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const text = await response.text();
          this.databases[key].data = this.parseCSV(text);
        } catch (err) {
          console.warn(`Could not load ${file}:`, err);
          this.databases[key].data = [];
        }
      }

      this.ready = true;
      return true;
    } catch (err) {
      console.error('Error loading databases:', err);
      return false;
    }
  }

  // Case-insensitive partial match
  matches(haystack, needle) {
    return haystack.toLowerCase().includes(needle.toLowerCase());
  }

  // Search across all databases
  search(query) {
    if (!query || query.trim().length === 0) {
      return { success: false, message: 'Empty search query' };
    }

    const q = query.trim();
    const results = [];

    // Search CAS database - match on "Requester"
    for (const record of this.databases.cas.data) {
      if (this.matches(record.Requester || '', q)) {
        results.push({
          system: 'CAS',
          color: this.databases.cas.color,
          systemLabel: 'Cong Assistance',
          name: record.Requester,
          type: record.Type || '—',
          category: record['Purpose/Occasion'] || '—',
          barangay: record.Barangay || '—',
          status: record.Status || '—',
          date: this.parseDate(record['Date Filed']) || '—',
          notes: record.Notes || '',
          encoder: record.Encoder || '',
          amount: record.Amount || '',
          rawData: record
        });
      }
    }

    // Search Bedridden database - match on "Patient" OR "Claimant"
    for (const record of this.databases.bedridden.data) {
      if (this.matches(record.Patient || '', q) || this.matches(record.Claimant || '', q)) {
        results.push({
          system: 'Bedridden',
          color: this.databases.bedridden.color,
          systemLabel: 'Bedridden Requests',
          name: record.Patient || record.Claimant || '—',
          type: record.Category || '—',
          category: record.Category || '—',
          barangay: record.Barangay || '—',
          status: record.Status || '—',
          date: this.parseDate(record['Date Filed']) || '—',
          notes: record.Notes || '',
          encoder: '',
          address: record.Address || '',
          contact: record.Contact || '',
          rawData: record
        });
      }
    }

    // Search Device Claims database - match on "Beneficiary"
    for (const record of this.databases.devices.data) {
      if (this.matches(record.Beneficiary || '', q)) {
        results.push({
          system: 'Device',
          color: this.databases.devices.color,
          systemLabel: 'Device Claims',
          name: record.Beneficiary,
          type: record.Device || '—',
          category: record.Category || '—',
          barangay: '—',
          status: record.ClaimType || '—',
          date: this.parseDate(record.Date) || '—',
          notes: record.ReturnDate ? `Returned: ${record.ReturnDate}` : '',
          encoder: record.Encoder || '',
          qty: record.Qty || '',
          rawData: record
        });
      }
    }

    // Search Medicine Claims database - match on "Beneficiary"
    for (const record of this.databases.medicines.data) {
      if (this.matches(record.Beneficiary || '', q)) {
        results.push({
          system: 'Medicine',
          color: this.databases.medicines.color,
          systemLabel: 'Medicine Claims',
          name: record.Beneficiary,
          type: record.Medicine || '—',
          category: record.Type || '—',
          barangay: '—',
          status: 'Released',
          date: this.parseDate(record.Date) || '—',
          notes: `${record.Dosage} | Qty: ${record.Qty || 1}`,
          encoder: record.Encoder || '',
          pieces: record.Pieces || '',
          rawData: record
        });
      }
    }

    // Sort by date (newest first)
    results.sort((a, b) => {
      const dateA = this.parseDateForSort(a.date);
      const dateB = this.parseDateForSort(b.date);
      return dateB - dateA;
    });

    if (results.length === 0) {
      return {
        success: false,
        message: `No records found for "${q}". Please check the spelling or try a different search term.`
      };
    }

    // Group by person to show similar matches
    const groupedByName = {};
    results.forEach(r => {
      const key = r.name.toLowerCase();
      if (!groupedByName[key]) {
        groupedByName[key] = [];
      }
      groupedByName[key].push(r);
    });

    return {
      success: true,
      query: q,
      results: results,
      grouped: groupedByName,
      count: results.length,
      systems: {
        cas: results.filter(r => r.system === 'CAS').length,
        bedridden: results.filter(r => r.system === 'Bedridden').length,
        devices: results.filter(r => r.system === 'Device').length,
        medicines: results.filter(r => r.system === 'Medicine').length
      }
    };
  }

  // Parse date from YYYY-MM-DD format
  parseDate(dateStr) {
    if (!dateStr || dateStr === '—') return null;
    try {
      const [y, m, d] = dateStr.split('-');
      if (!y || !m || !d) return null;
      return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    } catch {
      return null;
    }
  }

  // Parse date for sorting (return timestamp)
  parseDateForSort(dateStr) {
    if (dateStr === '—') return 0;
    try {
      const [y, m, d] = dateStr.split('-');
      if (!y || !m || !d) return 0;
      return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getTime();
    } catch {
      return 0;
    }
  }

  // Format date as "Mon DD, YYYY"
  formatDate(dateStr) {
    if (!dateStr || dateStr === '—') return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '—';
    }
  }

  // Get status badge color
  getStatusBadgeColor(status) {
    const s = (status || '').toLowerCase();
    if (s === 'done' || s === 'completed' || s === 'released') return '#10b981';
    if (s === 'pending') return '#fbbf24';
    if (s === 'in progress') return '#3b82f6';
    return '#9ca3af';
  }

  // Get status badge text color (for contrast)
  getStatusBadgeTextColor(status) {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return '#78350f';
    return '#ffffff';
  }
}

// Create global singleton instance
window.unifiedSearch = new UnifiedSearchAssistant();
