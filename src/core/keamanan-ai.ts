import { Shields } from './Shields';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

class SecurityAI {
  private isSyncing: boolean = false;

  public async performLinguisticPatrol(input: string, userId: string) {
    const sensitivePatterns = ['admin access', 'bypass security', 'drop database', 'delete system', 'root access'];
    const matched = sensitivePatterns.filter(p => input.toLowerCase().includes(p));
    
    if (matched.length > 0) {
      await Shields.report({
        type: 'ai',
        severity: 'medium',
        event: `Suspicious linguistic pattern detected: ${matched.join(', ')}`,
        details: { input: input.substring(0, 100), userId }
      });
      return false;
    }
    return true;
  }

  public async autoBanSuspicious() {
    console.log("[SECURITY_AI] Analyzing flagged entities for auto-ban...");
    try {
      const q = query(collection(db, 'users'), where('status', '==', 'flagged'));
      const snap = await getDocs(q);
      
      const results = { banned: 0, failed: 0 };
      
      for (const userDoc of snap.docs) {
        try {
          await updateDoc(doc(db, 'users', userDoc.id), {
            status: 'banned',
            updatedAt: serverTimestamp(),
            'securityMetadata.bannedBy': 'AI_AUTO_PROTOCOL'
          });
          results.banned++;
        } catch (error) {
          try {
            handleFirestoreError(error, OperationType.UPDATE, `users/${userDoc.id}`);
          } catch (thrownError) {
            results.failed++;
          }
        }
      }

      await Shields.report({
        type: 'ai',
        severity: 'low',
        event: `AI Auto-Ban Protocol completed`,
        details: results
      });

      return results;
    } catch (error) {
      console.error('Auto-ban failed:', error);
      try {
        handleFirestoreError(error, OperationType.LIST, 'users');
      } catch (e) {}
      return null;
    }
  }

  public getSyncState() {
    return this.isSyncing;
  }
}

export const KeamananAI = new SecurityAI();
