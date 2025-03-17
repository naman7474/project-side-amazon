enum Roots {
  Auth = "/auth",
  Dashboard = "/dashboard",
}

// enum SubRoots {
// }

export const paths = {
  auth: {
    login: `${Roots.Auth}/login`,
    register: `${Roots.Auth}/register`,
  },
  dashboard: {
    root: Roots.Dashboard,
  },
};
