import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, LogIn, User as UserIcon } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, login, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-indigo-200' : 'text-white hover:text-indigo-200';
  };

  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <UtensilsCrossed className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Weekly Meal Planner</h1>
          </Link>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className={isActive('/')}>
                Calendar
              </Link>
              <Link to="/recipes" className={isActive('/recipes')}>
                Recipes
              </Link>
              <Link to="/shopping-list" className={isActive('/shopping-list')}>
                Shopping List
              </Link>
            </nav>

            <div className="relative">
              {isAuthenticated ? (
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="flex items-center space-x-2 hover:text-indigo-200">
                    <img
                      src={user?.avatarUrl}
                      alt={user?.fullName}
                      className="w-8 h-8 rounded-full bg-indigo-200"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-900">Signed in as</p>
                        <p className="truncate text-sm font-medium text-gray-900">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => logout()}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <button
                  onClick={() => login()}
                  className="flex items-center space-x-2 hover:text-indigo-200"
                >
                  <LogIn className="h-6 w-6" />
                  <span className="hidden md:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
