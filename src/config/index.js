const MODE = import.meta.env.MODE // 环境变量

export const baseUrl = MODE === 'development' ? '' : 'http://121.41.2.76:7001';
