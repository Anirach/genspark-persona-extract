import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Globe,
  Files,
  ClipboardList,
  Sliders,
  BarChart3,
  CheckCheck,
  GitBranch,
  MessageSquare,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  const hash = location.hash || "";
  const isPath = (p: string) => location.pathname === p;
  const isHash = (h: string) => location.pathname === "/personaextraction" && hash === h;

  return (
    <Sidebar>
      <SidebarContent>
        {/* Owner menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Persona Extraction</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isPath("/personaextraction")}> 
                  <NavLink to="/personaextraction" end className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Start Extraction</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isHash("#review")}>
                  <a href="/personaextraction#review" className="flex items-center gap-2">
                    <CheckCheck className="h-4 w-4" />
                    <span>Submit for Review</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reviewer/Admin menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Reviewer & Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isPath("/reviewer-admin")}>
                  <NavLink to="/reviewer-admin" className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Review Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System menu */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isPath("/system-dashboard")}>
                  <NavLink to="/system-dashboard" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>System Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
