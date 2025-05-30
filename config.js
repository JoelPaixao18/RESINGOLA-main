// config.js
// Configurações globais da aplicação

const ENV = {
  DEVELOPMENT: {
    API_BASE_URL: 'http://192.168.213.25/RESINGOLA-main/Backend',
    DEBUG_MODE: true
  },
  PRODUCTION: {
    API_BASE_URL: 'https://seusite.com/api',
    DEBUG_MODE: false
  }
};

// Seleciona o ambiente atual (mude para 'PRODUCTION' quando for publicar)
const CURRENT_ENV = 'DEVELOPMENT';

// Exporta as configurações do ambiente selecionado
export const API_URL = ENV[CURRENT_ENV].API_BASE_URL;
export const DEBUG_MODE = ENV[CURRENT_ENV].DEBUG_MODE;
export const TIMEOUT = 15000; // 15 segundos para timeout das requisições

// Exporta endpoints específicos (opcional)
export const ENDPOINTS = {
  GET_USER: '/get_user.php',
  LOGIN: '/login.php',
  // Adicione outros endpoints aqui
};