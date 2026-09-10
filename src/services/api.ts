export const IMGBB_KEY = '7c3630f9221f7c4b2da8514ce6340c33';

export async function uploadImage(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_KEY);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.imgbb.com/1/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.data?.url) {
            resolve(res.data.url);
            return;
          }
        } catch {
          // fallback
        }
      }
      // Fallback to local Data URL
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    };

    xhr.onerror = () => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.onerror = () => reject(new Error('Network error uploading image'));
      reader.readAsDataURL(file);
    };

    xhr.send(formData);
  });
}

export async function sendAIChatMessage(message: string, uid?: string, userName?: string): Promise<{ reply: string; ticketId?: string }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, uid, userName }),
    });
    if (!res.ok) {
      throw new Error('Server returned ' + res.status);
    }
    return await res.json();
  } catch (err: any) {
    return {
      reply: 'Support is currently available for tournament guidelines, wallet deposits, and withdrawals. Please contact administrator if urgent.',
    };
  }
}

export async function sendOtp(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Could not connect to authentication server' };
  }
}

export async function verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Could not connect to authentication server' };
  }
}

export async function validateJoinTournament(tournament: any, userWallet: any, userProfile: any) {
  try {
    const res = await fetch('/api/tournaments/validate-join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournament, userWallet, userProfile }),
    });
    return await res.json();
  } catch {
    return { valid: true }; // Fallback to client logic if offline
  }
}

export async function validateWithdraw(amount: number, winningBalance: number, upiId: string) {
  try {
    const res = await fetch('/api/wallet/validate-withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, winningBalance, upiId }),
    });
    return await res.json();
  } catch {
    return { valid: true, authorizedAmount: amount };
  }
}
