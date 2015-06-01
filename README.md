ICA-SVP Web client
========

<img src="Images/ICA_SVP_logo.png?raw=true" height="100"/>

WHAT IS ICA-SVP?
--------------

The influence of cognitive load, environmental factors and emotional arousal on pupillary responses has been widely studied in the psychophysiology literature. Most experiments in such studies made use of specialized clinical equipment to collect eye data, which can be expensive and therefore not accessible to anyone willing to conduct similar experiments. Consequently, many efforts have been made to use video-based eye tracking systems as pupillometers. ICA-SVP is a software tool for such purpose that can be used out of the box for real-time cognitive effort estimation and pupillary response classification based on visual stimuli and eye-tracking. The cognitive effort is quantified according to the [index of cognitive activity (ICA)] (https://encrypted.google.com/patents/US6090051). Serial visual presentation (SVP) is used to present discrete tasks at certain configurable speed.

WHAT CAN I DO WITH IT?
---------

ICA-SVP allows you to conduct experiments on which cognitive effort and pupillary response induced by visual stimuli can be evaluated. Experiment participants are placed in front of a visual display and their head is fixed (e.g. using a pillow). Next, a stimuli sequence is presented serially while a remote eye tracker collects data from the eyes of the subject. In order to reduce the influence of head movement on pupil size measurements, when the participant loses the focus from the visual item (determined by the gaze position), the presentation automatically pauses. Moreover, the presentation resumes when the participant focus back into it.

<img src="Images/Experiment_setup.png?raw=true" height="200"/>

HOW TO RUN IT?
---------

- Download the source code and copy it into the web server root directory.
- Configure the [ICA-SVP server] (https://github.com/danielgg88/ICA-SVP_Server) IP address into the /app/js/config.js file. All configuration parameters are defined in this file. Be sure the server is running before you continue.
- Start a new [Node.js](https://nodejs.org/) server instance by executing "npm start" in your command line.
- Open the application in a web browser (e.g.) "http://SERVER-ADDRESS/app/#/home".

HOW TO USE?
---------

<img src="Images/System_flow.png?raw=true" height="150"/>
<img src="Images/Home_Screen.PNG?raw=true" height="200"/>

The home screen offers navigation through the whole experimentation process. Prior an experiment, the eye tracker, and the system must be calibrated:

### 1. Calibrate the EyeTribe.

### 2. Calibrate the System. 

Since it is possible to set different background colors for experiment trials, this option is also offered for calibration in order to simulate the lighting conditions of subsequent experiments. In case dynamic background color mode (described further) is selected, we suggest to set the calibration background color to the desired base color value to be used in further experiment executions.

<img src="Images/Screen_Calibration.png?raw=true" height="200"/>

### 3. Configure the desired experiment. 

The content to be shown has to be defined in a JSON format file and put it into the \app\content\ directory. Visual stimuli can be of two types, text, and/or images. [Read more](README_Experiment_configuration.txt).

<img src="Images/Screen_Configuration.PNG?raw=true" height="400"/>

### 4. Conduct the experiment. 

<img src="Images/Experiment_Screen.png?raw=true" height="150"/>
<img src="Images/Experiment_Scree_Image.png?raw=true" height="150"/>

### 5. Result analysis.

This application provides a list of all previously conducted experiments and allows you to analyze each trial independently in a graphical environment where pre-processed and processed (after cleaning, removing blinks and applying a wavelet transformation) data is presented as line chart graphs. Red and green markers point out the moment when stimuli and resting periods started respectively. 

<img src="Images/Result_List.png?raw=true" height="150"/> <br/>
<img src="Images/Result_Analysis.jpg?raw=true" height="600"/>

Results are presented for every 1 second of eye data stream at the time in the format of [Left_eye, Right_eye] or [[Left_eye_1,Left_eye_2,...],[Right_eye_1, Right_eye_2,...]].

Pupillary response seconds are classified according to one of the following classes (6):
- Cognitive effort + luminance (steady — brightening — obscuring)
- No cognitive effort + luminance (steady — brightening — obscuring)

LOGS
---------

Log files are stored in the [ICA-SVP server] (https://github.com/danielgg88/ICA-SVP_Server) file system.

SOFTWARE ARCHITECTURE
--------------

The SVP web client is the graphical user interface (GUI) through which a user can interact in order to calibrate both, the eye tracker, and the system before an experiment; conduct an experiment; list results from previously recorded experiments and analyze each separately. The web client is implemented based on the Model View Controller (MVC) architectural framework.

<img src="Images/ICA-SVP_Software_Architecture.png?raw=true" height="200"/>

SOFTWARE DEPENDENCIES
---------

[ICA-SVP server] (https://github.com/danielgg88/ICA-SVP_Server) </br>
[Node.js 0.10.35](https://nodejs.org/) </br>
[Bower 1.4.1](http://bower.io/) </br>

HARDWARE
--------------

[The EyeTribe] (https://theeyetribe.com/) eye tracker <br/>

<img src="Images/ICA-SVP_Hardware_Architecture.png?raw=true" height="200"/>

Collaborators:
--------------
Daniel Garcia <dgac@itu.dk>, Ioannis Sintos <isin@itu.dk>, John Paulin Hansen <paulin@itu.dk>

[IT University of Copenhagen](http://www.itu.dk/en)
