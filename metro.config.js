// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('cjs'); // Adicione extensões de arquivo adicionais, se necessário

module.exports = config;