/*
 * Copyright 2017 Eduze
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to
 * whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package org.eduze.fyp.core;

import org.eduze.fyp.api.CameraCoordinator;
import org.eduze.fyp.api.MapProcessor;
import org.eduze.fyp.api.State;
import org.eduze.fyp.api.StateManager;
import org.eduze.fyp.api.annotations.AutoStart;
import org.eduze.fyp.api.listeners.ProcessedMapListener;
import org.eduze.fyp.core.resources.GlobalMap;
import org.eduze.fyp.api.resources.LocalMap;
import org.eduze.fyp.api.resources.PersonSnapshot;
import org.eduze.fyp.api.util.Args;
import org.eduze.fyp.core.util.AccuracyTester;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.eduze.fyp.core.Constants.MAP_REFRESH_INTERVAL;
import static org.eduze.fyp.core.Constants.MAP_REFRESH_THRESHOLD;

@AutoStart(startOrder = 1)
public class MapProcessorImpl implements MapProcessor {

    private static final Logger logger = LoggerFactory.getLogger(MapProcessorImpl.class);

    private final GlobalMap globalMap = new GlobalMap();
    private final StateManager stateManager = new StateManager(State.STOPPED);
    private final Queue<LocalMap> localMapQueue = new LinkedList<>();
    private CameraCoordinator cameraCoordinator;
    private Set<ProcessedMapListener> mapListeners = new HashSet<>();
    private ExecutorService processor;

    private AccuracyTester accuracyTester = null;

    public AccuracyTester getAccuracyTester() {
        return accuracyTester;
    }

    public void setAccuracyTester(AccuracyTester accuracyTester) {
        this.accuracyTester = accuracyTester;
    }

    private ZoneMapper zoneMapper = null;

    private PhotoMapper photoMapper = null;

    public ZoneMapper getZoneMapper() {
        return zoneMapper;
    }

    public PhotoMapper getPhotoMapper() {
        return photoMapper;
    }

    public void setPhotoMapper(PhotoMapper photoMapper) {
        this.photoMapper = photoMapper;
    }

    public void setZoneMapper(ZoneMapper zoneMapper) {
        this.zoneMapper = zoneMapper;
    }

    @Override
    public void addLocalMap(LocalMap map) {
        stateManager.checkState(State.STARTED);
        logger.debug("Adding a local map for camera : {}", map.getCameraId());

        synchronized (this) {
            localMapQueue.add(map);
        }
    }

    @Override
    public synchronized void addProcessedMapListener(ProcessedMapListener listener) {
        mapListeners.add(listener);
    }

    @Override
    public void removeProcessedMapListener(ProcessedMapListener listener) {
        mapListeners.remove(listener);
    }

    @Override
    public void nextFrame(Date timestamp) {
        List<List<PersonSnapshot>> snapshots = globalMap.getSnapshot();
        synchronized (this) {
            mapListeners.forEach(listener -> listener.onFrame(snapshots,timestamp));
        }
    }

    @Override
    public void start() {

        globalMap.setZoneMapper(zoneMapper);
        globalMap.setPhotoMapper(photoMapper);
        globalMap.setAccuracyTester(accuracyTester);

        Args.notNull(cameraCoordinator, "cameraCoordinator");

        stateManager.checkState(State.STOPPED);
        logger.debug("Starting map collector");

        processor = Executors.newSingleThreadExecutor();
        processor.submit((Runnable) () -> {
            try {
                stateManager.waitFor(State.STARTED);
            } catch (InterruptedException e) {
                logger.error("Map processing thread interrupted while waiting for start", e);
            }
            logger.debug("Starting map processing");

            // TODO: 9/3/17 Optimize to use a thread pool of 2 at least to focus more on processing
            long lastTimestamp = 0;
            for (; ; ) {
                if (!stateManager.isState(State.STARTED)) {
                    break;
                }

                LocalMap nextMap;
                synchronized (this) {
                    nextMap = localMapQueue.poll();
                }

                try {
                    if (nextMap != null) {
                        globalMap.update(nextMap);
                    }

                    if (cameraCoordinator.getCurrentTimestamp() - lastTimestamp > MAP_REFRESH_INTERVAL) {
                        lastTimestamp = cameraCoordinator.getCurrentTimestamp();
                        long minTimestamp = lastTimestamp - MAP_REFRESH_THRESHOLD;
                        globalMap.refresh(minTimestamp);
                    }


                    if (nextMap != null) {
                        List<List<PersonSnapshot>> snapshots = globalMap.getSnapshot();
                        synchronized (this) {
                            mapListeners.forEach(listener -> listener.mapProcessed(snapshots));
                        }
                    }

                } catch (Exception e) {
                    logger.error("Error occurred in map processing", e);
                }
            }
        });

        stateManager.setState(State.STARTED);
        logger.info("Map collector started");
    }

    @Override
    public void stop() {
        stateManager.checkState(State.STARTED);
        logger.debug("Stopping map collector");

        processor.shutdownNow();

        logger.info("Map collector stopped");
        stateManager.setState(State.STOPPED);
    }

    public synchronized void setMapListeners(Set<ProcessedMapListener> listeners) {
        if (listeners != null) {
            mapListeners.addAll(listeners);
        }
    }

    public void setCameraCoordinator(CameraCoordinator cameraCoordinator) {
        this.cameraCoordinator = cameraCoordinator;
    }
}