import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Receipt as BillingIcon,
  Assessment as ReportsIcon,
  Notifications as AlertsIcon,
} from '@mui/icons-material';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { name: 'Inventory', href: '/inventory', icon: <InventoryIcon /> },
  { name: 'Billing', href: '/billing', icon: <BillingIcon /> },
  { name: 'Reports', href: '/reports', icon: <ReportsIcon /> },
  { name: 'Alerts', href: '/alerts', icon: <AlertsIcon /> },
];

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Inventory System</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors ${
                  isActive ? 'bg-purple-50 text-purple-700' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
} 