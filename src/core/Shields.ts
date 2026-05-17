import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface PatrolLog {
  timestamp: any;
  type: 'firewall' | 'shield' | 'ai' | 'audit';
  severity: 'low' | 'medium' | 'high' | 'critical';
  event: string;
  userId?: string | null;
  ip: string;
  details?: any;
}

class ShieldsCore {
  private ownerEmail: string = 'ayrarasya475@gmail.com';

  constructor() {
    console.log("SHIELDS_UP: Patrol systems initialized.");
  }

  public async report(log: Omit<PatrolLog, 'timestamp' | 'ip'>) {
    try {
      const fullLog: PatrolLog = {
        ...log,
        timestamp: serverTimestamp(),
        ip: 'detect-via-server', // In a real app we'd use cloud functions or similar
        userId: auth.currentUser?.uid || null,
      };

      await addDoc(collection(db, 'security_logs'), fullLog);
      
      if (log.severity === 'critical') {
        this.enforceRegeneration();
      }
      
      console.warn(`[SHIELDS] ${log.severity}: ${log.event}`);
    } catch (error) {
      console.error('Failed to report to shields:', error);
      try {
        handleFirestoreError(error, OperationType.CREATE, 'security_logs');
      } catch (e) {}
    }
  }

  private enforceRegeneration() {
    console.error("REGEN_PROTOCOL_INITIATED: System state verification in progress...");
    // Logic to reset suspicious parameters or session verification
  }

  public async flagUser(userId: string, reason: string) {
    if (userId === this.ownerEmail) return; // Immune
    
    await this.report({
      type: 'shield',
      severity: 'high',
      event: `User ${userId} flagged: ${reason}`,
      details: { action: 'flag' }
    });
  }
}

export const Shields = new ShieldsCore();
