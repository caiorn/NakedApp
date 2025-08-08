/**
 * CacheMemory - Cache simples em memória com TTL por chave.
 * Uso: ideal para cache temporário em aplicações monolíticas.
 * Recomendações:
 * - Para aplicações que cresçam ou tenham múltiplos servidores, utilize KeyDB, Redis ou Memcached para cache distribuído.
 * - O cache é ideal para reduzir consultas repetidas ao banco de dados e melhorar a performance em cenários monolíticos.
 * 
*/

export const CacheKeys = {
  USER: (id : number) => `user:${id}`,
  // Exemplo: 'users:list' para lista de usuários
};

class CacheMemory {
  cache: Map<any, any>;
  defaultTTLms: number;
  
  constructor(defaultTTLMinutes = 5) {
    this.cache = new Map();
    // converte TTL de minutos para milissegundos
    this.defaultTTLms = defaultTTLMinutes * 60 * 1000;
    // Limpeza periódica de entradas expiradas a cada 5 minutos
    setInterval(() => this.cleanupExpired(), 5 * 60 * 1000);
  }

  set(key: string, value: any, ttlMin: number) {
    if (this.cache.has(key)) {
      console.log(`\x1b[33m[CacheMemory] Overwriting key: "${key}"\x1b[0m`);
    }
    const ttlMs = (ttlMin * 60 * 1000) || this.defaultTTLms;
    const expires = Date.now() + (ttlMs);
  this.cache.set(key, { value, expires });
    console.log(`\x1b[32m[CacheMemory] Set key: "${key}" with TTL: ${ttlMs / 60 / 1000} m\x1b[0m`);
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) {
      console.log(`\x1b[31m[CacheMemory] Get key: "${key}" - MISS\x1b[0m`);
      return null;
    }
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      console.log(`\x1b[33m[CacheMemory] Get key: "${key}" - EXPIRED\x1b[0m`);
      return null;
    }
    console.log(`\x1b[32m[CacheMemory] Get key: "${key}" - HIT (Expires in: ${Math.ceil((entry.expires - Date.now()) / 1000)}s)\x1b[0m`);
    return entry.value;
  }

  delete(key: string) {
    const existed = this.cache.delete(key);
    console.log(`[CacheMemory] Delete key: "${key}" - ${existed ? '\x1b[32mSUCCESS\x1b[0m' : '\x1b[31mNOT FOUND\x1b[0m'}`);
  }

  clear() {
    this.cache.clear();
    console.log('\x1b[35m[CacheMemory] Cleared all keys\x1b[0m');
  }

  cleanupExpired() {
    const now = Date.now();
    let expiredCount = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
        expiredCount++;
        console.log(`\x1b[33m[CacheMemory] Cleanup - Removed expired key: "${key}"\x1b[0m`);
      }
    }
    if (expiredCount > 0) {
      console.log(`\x1b[33m[CacheMemory] Cleanup - Total expired keys removed: ${expiredCount}\x1b[0m`);
    }
  }

  showAllCaches(onlyKeysAndExpires = false) {
    if (this.cache.size === 0) {
      console.log('\x1b[35m[CacheMemory] No keys in cache\x1b[0m');
      return;
    }
    console.log('\x1b[36m[CacheMemory] Current cache keys:\x1b[0m');
    for (const [key, entry] of this.cache.entries()) {
      const timeLeft = Math.ceil((entry.expires - Date.now()) / 1000);
      if (onlyKeysAndExpires) {
        console.log(`\x1b[36mKey: "${key}", Expires in: ${timeLeft}s\x1b[0m`);
      } else {
        console.log(`\x1b[36mKey: "${key}", Value: ${JSON.stringify(entry.value)}, Expires in: ${timeLeft}s\x1b[0m`);
      }
    }
  }
}

export const cacheMemory = new CacheMemory();