'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    nationality?: string;
    idNumber?: string;
    avatar?: string;
    totalBookings: number;
    totalSpent: number;
    status: 'نشط' | 'محظور';
    joinedAt: Date;
    lastBooking?: Date;
    notes?: string;
}

// Sample data
const INITIAL_CUSTOMERS: Customer[] = [
    { id: 'C-001', name: 'محمد علي الشمري', email: 'mohammed@example.com', phone: '0501234567', nationality: 'سعودي', idNumber: '1234567890', totalBookings: 5, totalSpent: 8500, status: 'نشط', joinedAt: new Date('2025-06-15'), lastBooking: new Date('2026-01-10') },
    { id: 'C-002', name: 'سارة خالد العتيبي', email: 'sarah@example.com', phone: '0559876543', nationality: 'سعودي', idNumber: '0987654321', totalBookings: 3, totalSpent: 12500, status: 'نشط', joinedAt: new Date('2025-08-20'), lastBooking: new Date('2026-01-09') },
    { id: 'C-003', name: 'عبد الله بن زياد', email: 'abdullah@example.com', phone: '0561112233', nationality: 'إماراتي', idNumber: '7891234560', totalBookings: 2, totalSpent: 3200, status: 'نشط', joinedAt: new Date('2025-10-01'), lastBooking: new Date('2026-01-08') },
    { id: 'C-004', name: 'فهد إبراهيم العنزي', email: 'fahad@example.com', phone: '0544445555', nationality: 'سعودي', idNumber: '4567891230', totalBookings: 8, totalSpent: 22000, status: 'نشط', joinedAt: new Date('2025-03-10'), lastBooking: new Date('2026-01-07') },
    { id: 'C-005', name: 'نورة السعيد', email: 'noura@example.com', phone: '0533336666', nationality: 'كويتي', idNumber: '3216549870', totalBookings: 1, totalSpent: 1500, status: 'محظور', joinedAt: new Date('2025-12-01'), lastBooking: new Date('2026-01-06'), notes: 'تم الحظر بسبب عدم الدفع' },
    { id: 'C-006', name: 'مشاعل العتيبي', email: 'mashael@example.com', phone: '0522227777', nationality: 'سعودي', idNumber: '6543217890', totalBookings: 4, totalSpent: 15600, status: 'نشط', joinedAt: new Date('2025-07-22'), lastBooking: new Date('2026-01-05') },
    { id: 'C-007', name: 'أحمد محمود الغامدي', email: 'ahmed@example.com', phone: '0511118888', nationality: 'سعودي', idNumber: '1472583690', totalBookings: 6, totalSpent: 18200, status: 'نشط', joinedAt: new Date('2025-04-15') },
    { id: 'C-008', name: 'ريم عبد الرحمن', email: 'reem@example.com', phone: '0566669999', nationality: 'بحريني', idNumber: '9638527410', totalBookings: 2, totalSpent: 4800, status: 'نشط', joinedAt: new Date('2025-11-10') },
];

interface CustomersStore {
    customers: Customer[];

    // Actions
    getCustomer: (id: string) => Customer | undefined;
    getCustomerByEmail: (email: string) => Customer | undefined;
    addCustomer: (customer: Omit<Customer, 'id' | 'joinedAt' | 'totalBookings' | 'totalSpent'>) => Customer;
    updateCustomer: (id: string, updates: Partial<Customer>) => void;
    toggleCustomerStatus: (id: string) => void;
    deleteCustomer: (id: string) => void;

    // Update booking stats
    incrementBookingStats: (customerId: string, amount: number) => void;

    // Stats
    getCustomersCount: () => { total: number; active: number; blocked: number };
    getTopCustomers: (limit?: number) => Customer[];

    // Reset
    resetToDefaults: () => void;
}

export const useCustomersStore = create<CustomersStore>()(
    persist(
        (set, get) => ({
            customers: INITIAL_CUSTOMERS,

            getCustomer: (id) => get().customers.find(c => c.id === id),

            getCustomerByEmail: (email) => get().customers.find(c => c.email === email),

            addCustomer: (customerData) => {
                const newId = `C-${String(get().customers.length + 1).padStart(3, '0')}`;
                const newCustomer: Customer = {
                    ...customerData,
                    id: newId,
                    joinedAt: new Date(),
                    totalBookings: 0,
                    totalSpent: 0,
                };
                set(state => ({
                    customers: [newCustomer, ...state.customers]
                }));
                return newCustomer;
            },

            updateCustomer: (id, updates) => {
                set(state => ({
                    customers: state.customers.map(customer =>
                        customer.id === id ? { ...customer, ...updates } : customer
                    )
                }));
            },

            toggleCustomerStatus: (id) => {
                set(state => ({
                    customers: state.customers.map(customer =>
                        customer.id === id
                            ? { ...customer, status: customer.status === 'نشط' ? 'محظور' : 'نشط' as const }
                            : customer
                    )
                }));
            },

            deleteCustomer: (id) => {
                set(state => ({
                    customers: state.customers.filter(customer => customer.id !== id)
                }));
            },

            incrementBookingStats: (customerId, amount) => {
                set(state => ({
                    customers: state.customers.map(customer =>
                        customer.id === customerId
                            ? {
                                ...customer,
                                totalBookings: customer.totalBookings + 1,
                                totalSpent: customer.totalSpent + amount,
                                lastBooking: new Date()
                            }
                            : customer
                    )
                }));
            },

            getCustomersCount: () => {
                const customers = get().customers;
                return {
                    total: customers.length,
                    active: customers.filter(c => c.status === 'نشط').length,
                    blocked: customers.filter(c => c.status === 'محظور').length,
                };
            },

            getTopCustomers: (limit = 5) => {
                return [...get().customers]
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, limit);
            },

            resetToDefaults: () => {
                set({ customers: INITIAL_CUSTOMERS });
            }
        }),
        {
            name: 'diafat-customers-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Convenience hooks
export const useCustomer = (id: string) => useCustomersStore(state => state.getCustomer(id));
export const useAllCustomers = () => useCustomersStore(state => state.customers);
