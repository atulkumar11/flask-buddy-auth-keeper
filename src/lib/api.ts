
// API functions to connect with Flask backend

export async function saveUserNameToFlask(name: string): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:5000/api/save_user_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error from Flask:', data.error);
      return false;
    }
    
    console.log('Success from Flask:', data);
    return true;
  } catch (error) {
    console.error('Error connecting to Flask:', error);
    return false;
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; name?: string; email?: string; error?: string }> {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }
    
    return { success: true, name: data.name, email: data.email };
  } catch (error) {
    console.error('Error connecting to Flask:', error);
    return { success: false, error: 'Network error, please try again' };
  }
}

export async function signupUser(name: string, email: string, password: string): Promise<{ success: boolean; name?: string; email?: string; error?: string }> {
  try {
    const response = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Signup failed' };
    }
    
    return { success: true, name: data.name, email: data.email };
  } catch (error) {
    console.error('Error connecting to Flask:', error);
    return { success: false, error: 'Network error, please try again' };
  }
}
