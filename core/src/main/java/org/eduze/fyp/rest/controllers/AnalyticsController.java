/*
 * Copyright 2017 Eduze
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

package org.eduze.fyp.rest.controllers;

import org.eduze.fyp.rest.services.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/analytics")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);

    private AnalyticsService analyticsService;

    @GET
    @Path("/timestampCount/{from}/{to}")
    public Response getTimestampCount(@PathParam("from") long from, @PathParam("to") long to){
        try {
            return Response.ok(analyticsService.getTimestampCount(from, to)).build();
        }
         catch (Exception e) {
            logger.error("Error occurred when obtaining map. {}", e);
            return Response.status(500).build();
        }

    }

    @GET
    @Path("/zoneStatistics/{from}/{to}")
    public Response getZoneStatistics(@PathParam("from") long from, @PathParam("to") long to){
        try {
            return Response.ok(analyticsService.getZoneStatistics(from, to)).build();
        }
        catch (Exception e) {
            logger.error("Error occurred when obtaining map. {}", e);
            return Response.status(500).build();
        }

    }

    @GET
    @Path("/crossCounts/{from}/{to}")
    public Response getCrossCounts(@PathParam("from") long from, @PathParam("to") long to){
        try {
            return Response.ok(analyticsService.getCrossCount(from, to)).build();
        }
        catch (Exception e) {
            logger.error("Error occurred when obtaining map. {}", e);
            return Response.status(500).build();
        }

    }

    @GET
    @Path("/getMap")
    public Response getMap() {
        try {
            return Response.ok(analyticsService.getMap()).build();
        } catch (Exception e) {
            logger.error("Error occurred when obtaining map. {}", e);
            return Response.status(500).build();
        }
    }

    @GET
    @Path("/realTimeMap")
    public Response getRealTimeMap() {
        try {
            return Response.ok(analyticsService.getRealTimeMap()).build();
        } catch (Exception e) {
            logger.error("Error occurred when obtaining real time map. {}", e);
            return Response.status(500).build();
        }
    }

    @GET
    @Path("/realTimeMap/{id}")
    public Response getRealTimeInfo(@PathParam("id") int id) {
        try {
            return Response.ok(analyticsService.getPhotos(id)).build();
        } catch (Exception e) {
            logger.error("Error occurred when obtaining real time map. {}", e);
            return Response.status(500).build();
        }
    }

    @GET
    @Path("/heatMap/{from}/{to}")
    public Response getHeatMap(@PathParam("from") long from, @PathParam("to") long to) {
        try {
            return Response.ok(analyticsService.getHeatMap(from, to)).build();
        } catch (Exception e) {
            logger.error("Error occurred when obtaining heat map", e);
            return Response.status(500).build();
        }
    }

    @GET
    @Path("/count/{from}/{to}")
    public Response getCount(@PathParam("from") long from, @PathParam("to") long to) {
        try {
            return Response.status(200).entity(analyticsService.getCount(from, to)).build();
        } catch (Exception e) {
            logger.error("Error occurred when obtaining heat map", e);
            return Response.status(500).build();
        }
    }

    @GET
    @Path("/stoppoints/{from}/{to}/{radius}/{time}/{height}/{width}")
    public Response getStopPoints(@PathParam("from") long from, @PathParam("to") long to, @PathParam("radius") int radius,
                                  @PathParam("time") int time, @PathParam("height") int height, @PathParam("width") int width) {
        try {
            return Response.status(200).entity(analyticsService.getStopPoints(from, to, radius, time, height, width)).build();
        } catch (Exception e) {
            logger.error("Error occurred when obtaining heat map", e);
            return Response.status(500).build();
        }
    }


    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }
}
