# Camera based Real-time Analytics on Movements of People (CRAMP)

We are developing a system for generating realtime analytics on movements of people in a multiple camera monitored environment.
* Ground Mapped Human Movement Analytics.
* Aggregrated Analytical Maps.
  - Human Density Maps
  - Head Direction Maps
  - Speed Bound Maps
* Per Person Level Analytics using Short Term Re-Identification and Tracking.

_CRAMP_SENSE_(in _sense/_ directory) is the Camera Module of system which is responsible for
* Detecting New Persons
* Mapping of detected persons to world space. (Ground Place Mapping)
* Tracking of Persons (for purpose of detecting new persons)
* Obtain snapshots (for re-id purpose) of newly detected persons.
* Communicating results to Analytics Core.

## Getting Started

### Prerequisites
- The current version of AugurSense strictly depends on [OpenPosePersonDetector](https://github.com/eduze/OpenPosePersonDetector). Please follow the installation guide provided in the README. In short, you will require to install OpenCV, OpenPose and [pyboostcvconverter](https://github.com/Algomorph/pyboostcvconverter).
- Furthermore, inside maven project building we are using npm commands to build the Angular CLI project for Dashboard. Therefore, please install the [Angular CLI](https://cli.angular.io/) beforehand.
- OpenCV Python (This is covered in OpenPose installation docs)
- Once that is done, clone this repository.

### Building Analytics Engine
- Run `mvn clean install -DskipTests` in order to build the project.
- Copy the `libOpenPersonDetectorAPI.so` file created when building OpenPosePersonDetector to the sense/ directory.
- Install MySQL and create a new MySQL database (say `analytics_db`)

### Running in development mode

1. First, run the **main** method of `CHASS` class. To run this, following system
properties need to be added to the *run configuration*. 
   * Use `-D` as shown when passing as VM options.
    ```
    -Ddb.jdbc.url="jdbc:mysql://localhost:3306/analytics_db?createDatabaseIfNotExist=true"
    -Ddb.user="root"
    -Ddb.password="root"
    -Dorg.augur.sense.mode="ACTIVE"
    -Dlog4j.configurationFile=log4j2-dev.xml 
    ```
    * Visit `http://localhost:8000` for the dashboard

### Configuration

Go to `Settings -> Camera` and *Add Camera Groups*. Then when you run the 
python clients, they will automatically send their camera views for 
point mapping configuration. You can configure the mapping as shown below.

![Point Mapping Configuration](point_mapping.png)

### Examples

#### Real-time Processing
Python client processing two CCTV videos in parallel. All the detected people are mapped to the ground map and tracked. We
are capable of tracing across cameras as well.

![Real-time Processing](real-time_processing.png)

#### Viewing Tracked Person Timelines

Under *Time Line* tab, the paths followed by each individual is shown. You
can click on each path to see pictures of the person corresponding to the 
selected path.

(Note: this example timeline is taken from a test ran on PETS 2009 dataset)

![Time Line](global_map.png)

## Contributors

* Madhawa Vidanapathirana - madhawa.13@cse.mrt.ac.lk ([@madhawav](https://github.com/madhawav))
* Imesha Sudasingha - imesha.13@cse.mrt.ac.lk ([@IMS94](https://github.com/IMS94))
* Pasindu Kanchana - pasindukanchana.13@cse.mrt.ac.lk
* Jayan Vidanapathirana - jayancv.13@cse.mrt.ac.lk ([@jayancv](https://github.com/Jayancv))
