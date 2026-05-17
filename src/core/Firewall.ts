import { Shields } from './Shields';
import { getUserIP } from '../lib/network';

class FirewallCore {
  private requestCount: Map<string, number> = new Map();
  private lastReset: number = Date.now();
  private activeIP: string = '0.0.0.0';
  private blockedIPs: Set<string> = new Set();
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private async init() {
    this.activeIP = await getUserIP();
    this.initialized = true;
  }

  public async trackRequest(endpoint: string) {
    if (!this.initialized) await this.init();
    const ip = this.activeIP;

    if (this.blockedIPs.has(ip)) {
      throw new Error('Access denied by Firewall');
    }

    const now = Date.now();
    if (now - this.lastReset > 60000) {
      this.requestCount.clear();
      this.lastReset = now;
    }

    const count = (this.requestCount.get(ip) || 0) + 1;
    this.requestCount.set(ip, count);

    if (count > 50) { // Threshold for suspicious activity
      await Shields.report({
        type: 'firewall',
        severity: count > 100 ? 'critical' : 'high',
        event: `Rate limit exceeded: ${count} requests/min from ${ip}`,
        details: { endpoint, requests: count }
      });

      if (count > 100) {
        this.blockedIPs.add(ip);
      }
    }
  }

  public getActiveNetworkState() {
    return {
      currentIP: this.activeIP,
      status: this.blockedIPs.has(this.activeIP) ? 'BLOCKED' : (this.blockedIPs.size > 0 ? 'MITIGATING' : 'PROTECTED'),
      firewallActive: true,
      blocks: this.blockedIPs.size
    };
  }
}

export const Firewall = new FirewallCore();
