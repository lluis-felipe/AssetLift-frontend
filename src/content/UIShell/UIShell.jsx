import React from "react";
import {
  HeaderContainer,
  Header,
  SkipToContent,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  Content,
  SideNavMenu,
  SideNavMenuItem,
  Theme,
} from "@carbon/react";
import { Notification, User, Switcher, Fade } from "@carbon/react/icons";
import { Route, Routes, BrowserRouter, Link } from "react-router-dom";

import ErrorBoundary from "../../components/ErrorBoundary";
import LandingPage from "../LandingPage";
import NotFound from "../../components/NotFound";
import Users from "../Users/Users";
import UserForm from "../Forms/UserForm";
import Asset from "../Asset/Asset";
import AssetForm from "../Forms/AssetForm";

class UIShell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: `/${window.location.pathname.split("/")[1] ?? ""}`,
    };
  }

  render() {
    return (
      <BrowserRouter>
        <Theme theme="g90">
          <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
              <div>
                <Header aria-label="IBM Platform Name">
                  <SkipToContent />
                  <HeaderMenuButton
                    aria-label="Open menu"
                    onClick={onClickSideNavExpand}
                    isActive={isSideNavExpanded}
                  />
                  <HeaderName href="#" prefix="Asset">
                    Lift
                  </HeaderName>
                  <HeaderNavigation aria-label="Carbon React App">
                    <HeaderMenuItem href="#">Contributing</HeaderMenuItem>
                    <HeaderMenuItem href="#">Contact</HeaderMenuItem>
                    <HeaderMenu aria-label="How To" menuLinkName="How To">
                      <HeaderMenuItem href="#one">Sub-link 1</HeaderMenuItem>
                      <HeaderMenuItem href="#two">Sub-link 2</HeaderMenuItem>
                      <HeaderMenuItem href="#three">Sub-link 3</HeaderMenuItem>
                    </HeaderMenu>
                  </HeaderNavigation>
                  <HeaderGlobalBar>
                    <HeaderGlobalAction
                      aria-label="User"
                      tooltipAlignment="end"
                    >
                      <User size={20} />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction
                      aria-label="Notifications"
                      tooltipAlignment="end"
                    >
                      <Notification size={20} />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction
                      aria-label="App Switcher"
                      tooltipAlignment="end"
                    >
                      <Switcher size={20} />
                    </HeaderGlobalAction>
                  </HeaderGlobalBar>
                  <ErrorBoundary>
                    <SideNav
                      aria-label="Side navigation"
                      expanded={isSideNavExpanded}
                    >
                      <SideNavItems>
                        <SideNavMenuItem
                          element={Link}
                          to="/"
                          isActive={this.state.activeItem === "/"}
                          onClick={() => {
                            this.setState({ activeItem: "/" });
                          }}
                        >
                          Overview
                        </SideNavMenuItem>
                        <SideNavMenu
                          renderIcon={Fade}
                          title="Applications"
                          defaultExpanded
                        >
                          <SideNavMenuItem
                            element={Link}
                            to="/asset"
                            isActive={this.state.activeItem === "/asset"}
                            onClick={() => {
                              this.setState({ activeItem: "/asset" });
                            }}
                          >
                            Asset
                          </SideNavMenuItem>
                          <SideNavMenuItem
                            element={Link}
                            to="/users"
                            isActive={this.state.activeItem === "/users"}
                            onClick={() => {
                              this.setState({ activeItem: "/users" });
                            }}
                          >
                            Users
                          </SideNavMenuItem>
                        </SideNavMenu>
                      </SideNavItems>
                    </SideNav>
                  </ErrorBoundary>
                </Header>
              </div>
            )}
          />
        </Theme>
        <Content className="content">
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/users" element={<Users />} />
            <Route path="/userform" element={<UserForm />} />
            <Route path="/asset" element={<Asset />} />
            <Route path="/assetform" element={<AssetForm />} />
          </Routes>
        </Content>
      </BrowserRouter>
    );
  }
}

export default UIShell;
