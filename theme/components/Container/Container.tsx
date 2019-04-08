import * as React from 'react';

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <header>
        <h1 className="title">
          <a href="/">pixelkritzel.de</a>
          <div className="subtitle">The blog of developer Timo Zöller</div>
        </h1>
        <nav>
          <button
            type="button"
            title="Show navigation"
            className="button button-clear show-navigation js-show-navigation"
          >
            Menu
          </button>
          <ul className="navigation-list js-navigation-list">
            <li>
              <a href="/">Home</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
