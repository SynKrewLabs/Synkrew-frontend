const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable package exports resolution for modern ESM libraries like @tanstack/react-query
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
