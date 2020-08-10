package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.common.flogger.FluentLogger;
import com.google.gson.Gson;
import com.google.sps.data.Trip;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns trip id and start location and destinations user inputs */
@MultipartConfig
@WebServlet("/api/destinations")
public class DestinationsServlet extends HttpServlet {

  private static final FluentLogger logger = FluentLogger.forEnclosingClass();

  private final Gson gson = new Gson();
  private final DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  private final UserService userService = UserServiceFactory.getUserService();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Key tripKey = KeyFactory.stringToKey(request.getParameter("tripKey"));
    Entity entity;
    try {
      entity = datastore.get(tripKey);
    } catch (EntityNotFoundException e) {
      Trip trip =
          new Trip(
              "", "", new ArrayList<String>(), new ArrayList<String>(), new ArrayList<String>());
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(trip));
      logger.atInfo().withCause(e).log("Unable to find Trip Entity %s", tripKey);
      return;
    }
    String start = (String) entity.getProperty("start");
    ArrayList<String> destinations;
    if (entity.getProperty("destinations") != null) {
      destinations = (ArrayList<String>) entity.getProperty("destinations");
    } else {
      destinations = new ArrayList<String>();
    }
    Trip trip = Trip.FromEntity(entity);
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(trip));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Key tripKey = KeyFactory.stringToKey(request.getParameter("tripKey"));
    Entity entity;
    String start = request.getParameter("start-location");
    String destination = request.getParameter("destinations");
    ArrayList<String> destinations;
    try {
      entity = datastore.get(tripKey);
    } catch (EntityNotFoundException e) {
      Trip trip =
          new Trip(
              "", "", new ArrayList<String>(), new ArrayList<String>(), new ArrayList<String>());
      response.setContentType("application/json;");
      response.getWriter().println(gson.toJson(trip));
      logger.atInfo().withCause(e).log("Unable to find Trip Entity %s", tripKey);
      return;
    }
    entity.setProperty("start", start);
    if (entity.getProperty("destinations") == null) {
      destinations = new ArrayList<String>();
    } else {
      destinations = (ArrayList<String>) entity.getProperty("destinations");
    }
    destinations.add(destination);
    entity.setProperty("destinations", destinations);
    datastore.put(entity);
    Trip trip = Trip.FromEntity(entity);
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(trip));
  }
}
