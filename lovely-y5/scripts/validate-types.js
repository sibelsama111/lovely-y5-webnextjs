const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Validando tipos...');
  execSync('tsc --noEmit', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Validación de tipos exitosa');
  process.exit(0);
} catch (error) {
  console.error('❌ Error en la validación de tipos');
  process.exit(1);
}