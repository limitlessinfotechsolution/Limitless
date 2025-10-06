// jest.setup.js
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Supabase client
jest.mock('src/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    })),
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    h1: 'h1',
    h2: 'h2',
    p: 'p',
    span: 'span',
    img: 'img',
    section: 'section',
    article: 'article',
    aside: 'aside',
    header: 'header',
    footer: 'footer',
    nav: 'nav',
    ul: 'ul',
    li: 'li',
    a: 'a',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    select: 'select',
    option: 'option',
    label: 'label',
  },
  AnimatePresence: ({ children }) => children,
}));

// Global test utilities
global.testUtils = {
  // Helper to wait for async operations
  waitForNextTick: () => new Promise(resolve => setTimeout(resolve, 0)),

  // Helper to create mock events
  createMockEvent: (type = 'click') => ({
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    type,
    target: { value: '', name: '' },
  }),

  // Helper to mock console methods
  mockConsole: () => {
    const originalConsole = { ...console };
    const mockConsole = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
    };
    Object.assign(console, mockConsole);
    return { originalConsole, mockConsole };
  },

  // Helper to restore console
  restoreConsole: (originalConsole) => {
    Object.assign(console, originalConsole);
  },
};

// Legacy mocks for backward compatibility
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = options.headers || {};
    this.body = options.body;
  }
};

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.statusText = options.statusText || 'OK';
    this.headers = options.headers || {};
    this.ok = this.status >= 200 && this.status < 300;
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }

  text() {
    return Promise.resolve(this.body);
  }
};

global.NextRequest = global.Request;
global.NextResponse = {
  json: (data, options = {}) => new Response(JSON.stringify(data), { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } }),
  redirect: (url) => ({ url, status: 302 }),
};
