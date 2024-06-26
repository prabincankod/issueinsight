import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon,Inbox } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/account", title: "Account", icon: Cog },
  { href: "/settings", title: "Settings", icon: Cog },
  { href: "/complaints", title: "Complaints", icon: Inbox },
];

export const additionalLinks: AdditionalLinks[] = [];
