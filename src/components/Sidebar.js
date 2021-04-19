/*!

=========================================================
* Now UI Dashboard React - v1.4.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React, { useState, useRef, useEffect } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Nav, NavLink } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// import logo from "logo-white.svg";
// import { useAuth0 } from "@auth0/auth0-react";

var ps;

const Sidebar = () => {
    // const {
    //     user,
    //     isAuthenticated,
    //   } = useAuth0();

    return (
        <div className="sidebar">
          <div className="logo">
            <a
              href="#"
              className="simple-text logo-mini"
              target="_blank"
            >
              <div className="logo-img">
                <img src="" alt="react-logo" />
              </div>
            </a>
            <a
              href="/"
              className="simple-text logo-normal"
              target="_blank"
            >
              Smart Irrigation
            </a>
          </div>
          <div className="sidebar-wrapper" ref="sidebar">
            <Nav>
                <li>
                    <NavLink
                        tag={RouterNavLink}
                        to="/"
                        exact
                        className="nav-link"
                        activeClassName="router-link-exact-active"
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        tag={RouterNavLink}
                        to="/external-api"
                        exact
                        activeClassName="router-link-exact-active"
                    >
                        External API
                    </NavLink>
                </li>
            </Nav>
              {/* {this.props.routes.map((prop, key) => {
                if (prop.redirect) return null;
                return (
                  <li
                    className={
                      this.activeRoute(prop.layout + prop.path) +
                      (prop.pro ? " active active-pro" : "")
                    }
                    key={key}
                  >
                    <NavLink
                      to={prop.layout + prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className={"now-ui-icons " + prop.icon} />
                      <p>{prop.name}</p>
                    </NavLink>
                  </li>
                );
              })}
            </Nav> */}
          </div>
        </div>
      );
}

export default Sidebar;