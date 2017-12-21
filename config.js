exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://admin:admin@ds133856.mlab.com:33856/pipeline-pigging-ops';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://admin:admin@ds133856.mlab.com:33856/pipeline-pigging-ops';
exports.PORT = process.env.PORT || 3000;
