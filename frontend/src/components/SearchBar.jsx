import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search by title, industry, or idea...',
  delay = 300,
  style = {},
}) => {
  const [localValue, setLocalValue] = useState(value);
  const isInitialMount = useRef(true);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce notification back to parent onChange
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (onChange) {
        onChange(localValue);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue, delay, onChange]);

  const handleClear = () => {
    setLocalValue('');
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div style={{ ...styles.container, ...style }}>
      <Search size={18} style={styles.icon} />
      <input
        type="text"
        className="form-input"
        style={styles.input}
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          style={styles.clearBtn}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    left: '0.875rem',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  input: {
    paddingLeft: '2.5rem',
    paddingRight: '2.5rem',
    height: '42px',
    backgroundColor: '#ffffff',
  },
  clearBtn: {
    position: 'absolute',
    right: '0.75rem',
    color: '#9ca3af',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 150ms ease',
  },
};

export default SearchBar;
