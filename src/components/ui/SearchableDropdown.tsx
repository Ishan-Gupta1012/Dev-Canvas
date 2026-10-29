'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

export interface SearchableDropdownOption {
  label: string;
  value: string;
  category?: string;
  hint?: string;
}

export interface SearchableDropdownProps {
  id?: string;
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  options: (string | SearchableDropdownOption)[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  allowCustom?: boolean;
  className?: string;
  helperText?: string;
}

export function SearchableDropdown({
  id: propId,
  label,
  icon,
  placeholder = 'Select or search...',
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  allowCustom = true,
  className = '',
  helperText,
}: SearchableDropdownProps) {
  const generatedId = useId();
  const inputId = propId || generatedId;

  // Normalize options into uniform { label, value, category?, hint? } objects
  const normalizedOptions: SearchableDropdownOption[] = React.useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { label: opt, value: opt };
      }
      return opt;
    });
  }, [options]);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync internal searchTerm with external value when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(value || '');
    }
  }, [value, isOpen]);

  // Filter options with autocomplete logic:
  // 1. Starts with query (case-insensitive)
  // 2. Contains query (case-insensitive)
  const filteredOptions = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return normalizedOptions;

    const startsWith: SearchableDropdownOption[] = [];
    const contains: SearchableDropdownOption[] = [];

    for (const opt of normalizedOptions) {
      const lower = opt.label.toLowerCase();
      if (lower.startsWith(q)) {
        startsWith.push(opt);
      } else if (lower.includes(q)) {
        contains.push(opt);
      }
    }

    // Sort startsWith matches alphabetically
    startsWith.sort((a, b) => a.label.localeCompare(b.label));
    contains.sort((a, b) => a.label.localeCompare(b.label));

    return [...startsWith, ...contains];
  }, [searchTerm, normalizedOptions]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If custom allowed and user typed something, commit it if not empty, otherwise revert
        if (allowCustom && searchTerm.trim() && searchTerm.trim() !== value) {
          onChange(searchTerm.trim());
        } else {
          setSearchTerm(value || '');
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, allowCustom, searchTerm, value, onChange]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const listItems = listRef.current.querySelectorAll('li');
      const item = listItems[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelectOption = (optionValue: string) => {
    onChange(optionValue);
    setSearchTerm(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex].value);
        } else if (allowCustom && searchTerm.trim()) {
          handleSelectOption(searchTerm.trim());
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm(value || '');
        break;
      case 'Tab':
        setIsOpen(false);
        if (allowCustom && searchTerm.trim() && searchTerm.trim() !== value) {
          onChange(searchTerm.trim());
        }
        break;
      default:
        break;
    }
  };

  // Helper to highlight matching text
  const renderHighlightedLabel = (text: string, query: string) => {
    if (!query.trim()) return text;
    const q = query.trim();
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;

    const before = text.substring(0, idx);
    const match = text.substring(idx, idx + q.length);
    const after = text.substring(idx + q.length);

    return (
      <>
        {before}
        <strong className="text-primary font-bold underline decoration-primary/40 underline-offset-2">
          {match}
        </strong>
        {after}
      </>
    );
  };

  const isExactMatch = filteredOptions.some(
    (o) => o.label.toLowerCase() === searchTerm.trim().toLowerCase()
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-on-surface mb-1 flex items-center justify-between"
        >
          <span className="flex items-center gap-1">
            {icon}
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </span>
          {helperText && (
            <span className="text-[11px] text-on-surface-variant font-normal">
              {helperText}
            </span>
          )}
        </label>
      )}

      {/* Input container */}
      <div
        className={`relative flex items-center w-full rounded-xl border transition-all ${
          disabled
            ? 'bg-surface-container-low/50 border-outline-variant/30 opacity-60 cursor-not-allowed'
            : isOpen
            ? 'border-primary ring-1 ring-primary bg-surface-container-lowest shadow-sm'
            : 'border-outline-variant/60 bg-surface-container-low hover:border-outline-variant hover:bg-surface-container-lowest'
        }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(0);
            if (!isOpen) setIsOpen(true);
            if (allowCustom) {
              onChange(e.target.value);
            }
          }}
          onFocus={() => {
            if (!disabled) {
              setSearchTerm(value || '');
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${inputId}-listbox`}
          className="w-full px-3 py-2 text-xs sm:text-sm text-on-surface bg-transparent focus:outline-hidden pr-16 truncate"
        />

        {/* Right action icons */}
        <div className="absolute right-2 flex items-center gap-1 text-on-surface-variant">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear selection"
              tabIndex={-1}
              className="p-1 hover:text-rose-600 rounded-md transition-colors"
            >
              <X size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (disabled) return;
              if (!isOpen) {
                setIsOpen(true);
                inputRef.current?.focus();
              } else {
                setIsOpen(false);
              }
            }}
            tabIndex={-1}
            title={isOpen ? 'Close options' : 'Open options'}
            className="p-1 hover:text-on-surface rounded-md transition-colors"
          >
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Floating Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          id={`${inputId}-listbox`}
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1.5 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg max-h-64 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Header indicator when filtering */}
          {searchTerm.trim() && (
            <div className="px-3 py-1.5 text-[11px] bg-surface-container-low/70 border-b border-outline-variant/40 text-on-surface-variant flex items-center justify-between">
              <span className="flex items-center gap-1 truncate">
                <Search size={11} className="text-primary shrink-0" />
                <span>
                  Filtering for &ldquo;<span className="font-semibold text-on-surface">{searchTerm.trim()}</span>&rdquo;
                </span>
              </span>
              <span className="text-[10px] font-mono shrink-0 ml-1">
                {filteredOptions.length} match{filteredOptions.length === 1 ? '' : 'es'}
              </span>
            </div>
          )}

          {/* Options list */}
          <ul ref={listRef} className="overflow-y-auto max-h-56 py-1 divide-y divide-outline-variant/10 text-xs sm:text-sm">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const isSelected = value.toLowerCase() === opt.value.toLowerCase();
                const isHighlighted = highlightedIndex === index;

                return (
                  <li
                    key={`${opt.value}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectOption(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                      isHighlighted
                        ? 'bg-primary/10 text-primary font-medium'
                        : isSelected
                        ? 'bg-surface-container-low text-primary font-medium'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="truncate">
                        {renderHighlightedLabel(opt.label, searchTerm)}
                      </span>
                      {opt.hint && (
                        <span className="text-[10px] text-on-surface-variant font-normal truncate">
                          {opt.hint}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check size={14} className="text-primary shrink-0" />
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-4 text-center text-xs text-on-surface-variant space-y-2">
                <p>No matching options found for &ldquo;{searchTerm}&rdquo;</p>
                {allowCustom && searchTerm.trim() && !isExactMatch && (
                  <button
                    type="button"
                    onClick={() => handleSelectOption(searchTerm.trim())}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs transition-colors flex items-center justify-center gap-1 mx-auto"
                  >
                    <span>Use custom &ldquo;{searchTerm.trim()}&rdquo;</span>
                  </button>
                )}
              </li>
            )}
          </ul>

          {/* Custom option prompt at bottom if typed value is not an exact match */}
          {allowCustom && searchTerm.trim() && !isExactMatch && filteredOptions.length > 0 && (
            <div className="p-2 border-t border-outline-variant/40 bg-surface-container-low/50">
              <button
                type="button"
                onClick={() => handleSelectOption(searchTerm.trim())}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-primary hover:bg-primary/10 font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>+ Use custom entry: <strong>&ldquo;{searchTerm.trim()}&rdquo;</strong></span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
