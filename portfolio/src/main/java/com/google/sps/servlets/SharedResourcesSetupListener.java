// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.common.flogger.FluentLogger;
import javax.servlet.annotation.WebListener;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletContextEvent;

@WebListener("SharedResourcesSetup")
public final class SharedResourcesSetupListener implements ServletContextListener {

  private static final FluentLogger logger = FluentLogger.forEnclosingClass();

  @Override
  public void contextInitialized(ServletContextEvent sce) {
    logger.atInfo().log("Initializing SharedResources on ServletContext");
    SharedResources.attachToContext(sce.getServletContext());
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    logger.atInfo().log("Cleaning up SharedResources on ServletContext");
    SharedResources.cleanupFromContext(sce.getServletContext());
  }
}
