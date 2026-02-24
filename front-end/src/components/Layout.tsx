import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-gray-200">
        <nav className="flex gap-6 h-14 items-center px-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/volunteers"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'}`
            }
          >
            Volunteers
          </NavLink>
          <NavLink
            to="/cat-colony"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'}`
            }
          >
            Cat & Colony Data
          </NavLink>
          <NavLink
            to="/veterinary"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'}`
            }
          >
            Veterinary Appts
          </NavLink>
          <NavLink
            to="/finance"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'}`
            }
          >
            Finance/Fundraising
          </NavLink>
          <NavLink
            to="/equipment"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'}`
            }
          >
            Equipment
          </NavLink>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
