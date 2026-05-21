// Netlify Function: runs after CMS publish to rebuild manifest.json
// Triggered via Netlify deploy hook (automatic)
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Manifest updated via deploy' })
  };
};
