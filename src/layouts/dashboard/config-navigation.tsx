import { ReactNode } from "react";

import SvgColor from "@/libs/components/SvgColor";

import { IAdminType } from "@/models/user";
import { paths } from "@/routes/paths";

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

type IConfigItem = {
  title: string;
  path: string;
  icon: ReactNode;
  items?: Array<{
    title: string;
    path: string;
  }>;
  adminTypes: Array<IAdminType>;
};

const navConfig: Array<IConfigItem> = [
  {
    title: "Dashboard",
    path: paths.dashboard.root,
    icon: icon("ic_dashboard"),
    adminTypes: [IAdminType.Merchant],
  },
  // {
  //   title: "Settings",
  //   path: paths.dashboard.settings,
  //   icon: icon("ic_settings"),
  //   adminTypes: [IAdminType.Superadmin],
  // },
];

const getAdminNavConfig = (adminType: IAdminType) =>
  navConfig.filter((item) => item.adminTypes.includes(adminType));

export default getAdminNavConfig;
