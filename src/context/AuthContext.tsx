import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Language } from '../types';
import { DEMO_FARMER_RAMESH, DEMO_BUYER_FRESHMART } from '../data/mockUsers';

export interface RegisteredAccount extends User {
  password?: string;
  registeredAt?: string;
}

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | 'guest';
  registeredUsers: RegisteredAccount[];
  loginAsDemoFarmer: () => void;
  loginAsDemoBuyer: () => void;
  loginCustom: (user: User) => void;
  loginWithCredentials: (
    identifier: string,
    password?: string,
    role?: UserRole
  ) => { success: boolean; error?: string; user?: User };
  registerFarmer: (data: {
    name: string;
    phone: string;
    village: string;
    location: string;
    state: string;
    language: Language;
    password?: string;
  }) => { success: boolean; error?: string; user?: User };
  registerBuyer: (data: {
    businessName: string;
    phone: string;
    email: string;
    businessType: string;
    location: string;
    state: string;
    password?: string;
  }) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  isFarmer: boolean;
  isBuyer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredAccount[]>(() => {
    const saved = localStorage.getItem('km_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [
          { ...DEMO_FARMER_RAMESH, password: 'password123' },
          { ...DEMO_BUYER_FRESHMART, password: 'password123' },
        ];
      }
    }
    return [
      { ...DEMO_FARMER_RAMESH, password: 'password123' },
      { ...DEMO_BUYER_FRESHMART, password: 'password123' },
    ];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('km_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_FARMER_RAMESH;
      }
    }
    return DEMO_FARMER_RAMESH;
  });

  useEffect(() => {
    localStorage.setItem('km_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const currentRole: UserRole | 'guest' = currentUser ? currentUser.role : 'guest';

  const loginAsDemoFarmer = () => {
    setCurrentUser(DEMO_FARMER_RAMESH);
    localStorage.setItem('km_current_user', JSON.stringify(DEMO_FARMER_RAMESH));
  };

  const loginAsDemoBuyer = () => {
    setCurrentUser(DEMO_BUYER_FRESHMART);
    localStorage.setItem('km_current_user', JSON.stringify(DEMO_BUYER_FRESHMART));
  };

  const loginCustom = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('km_current_user', JSON.stringify(user));
  };

  const loginWithCredentials = (
    identifier: string,
    password?: string,
    role?: UserRole
  ) => {
    const cleanId = identifier.trim().replace(/\D/g, '');
    const cleanEmail = identifier.trim().toLowerCase();

    const matched = registeredUsers.find((u) => {
      if (role && u.role !== role) return false;
      const uPhone = u.phone.replace(/\D/g, '');
      const phoneMatch = uPhone.endsWith(cleanId) || cleanId.endsWith(uPhone);
      const emailMatch = u.email && u.email.toLowerCase() === cleanEmail;
      return phoneMatch || emailMatch;
    });

    if (!matched) {
      // If user enters any phone number for demo, allow friendly auto-login or create account notice
      if (cleanId.length === 10) {
        const autoUser: User = {
          id: `${role || 'farmer'}-${Date.now()}`,
          name: role === 'buyer' ? 'Verified Buyer' : 'Farmer Partner',
          role: role || 'farmer',
          phone: `+91 ${cleanId}`,
          villageOrBusinessName: role === 'buyer' ? 'Agri Procurement Hub' : 'Koratagere Village',
          location: role === 'buyer' ? 'Bengaluru Wholesale Hub' : 'Koratagere, Karnataka',
          state: 'Karnataka',
          language: 'en',
          isVerified: true,
          rating: 5.0,
          completedOrdersCount: 0,
        };
        loginCustom(autoUser);
        return { success: true, user: autoUser };
      }
      return {
        success: false,
        error: 'No account found with this mobile number or email. Please register first.',
      };
    }

    loginCustom(matched);
    return { success: true, user: matched };
  };

  const registerFarmer = (data: {
    name: string;
    phone: string;
    village: string;
    location: string;
    state: string;
    language: Language;
    password?: string;
  }) => {
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    const newFarmer: RegisteredAccount = {
      id: `farmer-${Date.now()}`,
      name: data.name.trim(),
      role: 'farmer',
      phone: `+91 ${cleanPhone}`,
      villageOrBusinessName: data.village.trim(),
      location: `${data.village.trim()}, ${data.location.trim()}`,
      state: data.state,
      language: data.language,
      isVerified: true,
      rating: 5.0,
      completedOrdersCount: 0,
      cropsGrownOrPurchased: ['Tomato', 'Chilli', 'Paddy'],
      password: data.password || 'password123',
      registeredAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [newFarmer, ...prev]);
    loginCustom(newFarmer);
    return { success: true, user: newFarmer };
  };

  const registerBuyer = (data: {
    businessName: string;
    phone: string;
    email: string;
    businessType: string;
    location: string;
    state: string;
    password?: string;
  }) => {
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    const newBuyer: RegisteredAccount = {
      id: `buyer-${Date.now()}`,
      name: data.businessName.trim(),
      role: 'buyer',
      phone: `+91 ${cleanPhone}`,
      email: data.email.trim(),
      businessType: data.businessType,
      villageOrBusinessName: data.businessName.trim(),
      location: data.location.trim(),
      state: data.state,
      language: 'en',
      isVerified: true,
      rating: 5.0,
      completedOrdersCount: 0,
      cropsGrownOrPurchased: ['Tomato', 'Red Onion', 'Potato'],
      password: data.password || 'password123',
      registeredAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [newBuyer, ...prev]);
    loginCustom(newBuyer);
    return { success: true, user: newBuyer };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('km_current_user');
  };

  const value = {
    currentUser,
    currentRole,
    registeredUsers,
    loginAsDemoFarmer,
    loginAsDemoBuyer,
    loginCustom,
    loginWithCredentials,
    registerFarmer,
    registerBuyer,
    logout,
    isFarmer: currentUser?.role === 'farmer',
    isBuyer: currentUser?.role === 'buyer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
