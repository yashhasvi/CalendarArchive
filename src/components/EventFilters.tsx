import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Star } from 'lucide-react';

interface EventFiltersProps {
  selectedCategories: string[];
  selectedCountries: string[];
  showFavoritesOnly: boolean;
  onCategoryChange: (categories: string[]) => void;
  onCountryChange: (countries: string[]) => void;
  onFavoritesToggle: (show: boolean) => void;
  availableCategories: string[];
  availableCountries: string[];
  isOpen: boolean;
  onToggle: () => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  selectedCategories,
  selectedCountries,
  showFavoritesOnly,
  onCategoryChange,
  onCountryChange,
  onFavoritesToggle,
  availableCategories,
  availableCountries,
  isOpen,
  onToggle
}) => {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleCountryToggle = (country: string) => {
    if (selectedCountries.includes(country)) {
      onCountryChange(selectedCountries.filter(c => c !== country));
    } else {
      onCountryChange([...selectedCountries, country]);
    }
  };

  const clearAllFilters = () => {
    onCategoryChange([]);
    onCountryChange([]);
    onFavoritesToggle(false);
  };

  const activeFiltersCount = selectedCategories.length + selectedCountries.length + (showFavoritesOnly ? 1 : 0);

  return (
    <div className="relative">
      <motion.button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-4 py-2 glass-card dark:glass-card-dark rounded-2xl transition-all duration-300 ${
          activeFiltersCount > 0 ? 'ring-2 ring-blue-500/50' : ''
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter className="h-4 w-4 text-ink-600 dark:text-ink-400" />
        <span className="text-sm font-medium text-ink-700 dark:text-ink-300">
          Filters
        </span>
        {activeFiltersCount > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full mt-2 right-0 w-80 glass-card dark:glass-card-dark rounded-2xl p-6 soft-shadow dark:soft-shadow-dark z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-ink-900 dark:text-white">
                Filter Events
              </h3>
              <div className="flex items-center space-x-2">
                {activeFiltersCount > 0 && (
                  <motion.button
                    onClick={clearAllFilters}
                    className="text-xs text-coral-600 dark:text-coral-400 hover:text-coral-700 dark:hover:text-coral-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All
                  </motion.button>
                )}
                <motion.button
                  onClick={onToggle}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4 text-ink-500" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Favorites Toggle */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={(e) => onFavoritesToggle(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-ink-700 dark:text-ink-300">
                      Show Favorites Only
                    </span>
                  </div>
                </label>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-3">
                  Categories
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableCategories.map((category) => (
                    <label key={category} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-ink-600 dark:text-ink-400">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div>
                <h4 className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-3">
                  Countries/Regions
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableCountries.slice(0, 10).map((country) => (
                    <label key={country} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country)}
                        onChange={() => handleCountryToggle(country)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-ink-600 dark:text-ink-400">
                        {country}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventFilters;